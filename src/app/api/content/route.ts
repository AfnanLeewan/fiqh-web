import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ContentNode from '@/models/ContentNode';

// GET - Fetch all content nodes or search
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const parentId = searchParams.get('parentId');
    const type = searchParams.get('type');
    const path = searchParams.get('path');
    
    const query: Record<string, unknown> = { published: true };
    
    if (search) {
      // Search functionality
      const results = await ContentNode.find({
        $and: [
          { published: true },
          {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { summary: { $regex: search, $options: 'i' } },
              { body: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      }).limit(8);
      
      // Build full paths for each result
      const resultsWithPaths = await Promise.all(results.map(async (node) => {
        try {
          const path = await buildNodePath(node);
          return {
            ...node.toObject(),
            path
          };
        } catch (error) {
          console.error('Error building path for node:', node._id, error);
          return {
            ...node.toObject(),
            path: [node.slug]
          };
        }
      }));
      
      return NextResponse.json(resultsWithPaths);
    }
    
    if (path) {
      // Get content by path (e.g., /c/category/chapter/article)
      const pathArray = path.split('/').filter(Boolean);
      
      // For single path (category), find by slug with no parent
      if (pathArray.length === 1) {
        const content = await ContentNode.findOne({ 
          slug: pathArray[0],
          parentId: null,
          published: true 
        });
        
        if (!content) {
          return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }
        
        // Get children
        const children = await ContentNode.find({ 
          parentId: content._id,
          published: true 
        }).sort({ order: 1 });
        
        return NextResponse.json({ content, children });
      }
      
      // For multi-level paths, build the path recursively
      let currentContent = null;
      let parentId = null;
      
      // Find the content by traversing the path
      for (let i = 0; i < pathArray.length; i++) {
        const slug = pathArray[i];
        const query: Record<string, unknown> = { 
          slug: slug,
          published: true 
        };
        
        if (i === 0) {
          // First level: no parent
          query.parentId = null;
        } else {
          // Subsequent levels: parent is the previous content
          query.parentId = parentId;
        }
        
        currentContent = await ContentNode.findOne(query);
        
        if (!currentContent) {
          return NextResponse.json({ error: `Content not found at path: ${pathArray.slice(0, i + 1).join('/')}` }, { status: 404 });
        }
        
        parentId = currentContent._id;
      }
      
      if (!currentContent) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      
      // Get children if it's not an article
      let children = [];
      if (currentContent.type !== 'article') {
        children = await ContentNode.find({ 
          parentId: currentContent._id,
          published: true 
        }).sort({ order: 1 });
      }
      
      return NextResponse.json({ content: currentContent, children });
    }
    
    if (parentId) {
      // Get children of a specific parent
      const children = await ContentNode.find({ 
        parentId: parentId,
        published: true 
      }).sort({ order: 1 });
      return NextResponse.json(children);
    }
    
    if (type) {
      // Get all content of specific type
      query.type = type;
    }
    
    // Default: get all content
    const content = await ContentNode.find(query).sort({ order: 1 });
    return NextResponse.json(content);
    
  } catch (error) {
    console.error('GET /api/content error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Create new content node
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { slug, title, summary, type, author, badge, body: content, parentId, order, published = true } = body;
    
    // Validate required fields
    if (!slug || !title || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, type' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists at the same level
    const existingSlug = await ContentNode.findOne({ 
      slug, 
      parentId: parentId || null 
    });
    
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug already exists at this level' },
        { status: 409 }
      );
    }
    
    // Create new content node
    const newContent = new ContentNode({
      slug,
      title,
      summary,
      type,
      author,
      badge,
      body: content,
      parentId: parentId || null,
      order: order || 0,
      published
    });
    
    const savedContent = await newContent.save();
    return NextResponse.json(savedContent, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/content error:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

// PUT - Update existing content node
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        { error: 'Missing content ID' },
        { status: 400 }
      );
    }

    // Handle undefined badge values by explicitly setting to null
    if (updateData.badge === undefined) {
      updateData.badge = null;
    }

    console.log('Updating content with ID:', _id);
    console.log('Update data:', updateData);
    
    const updatedContent = await ContentNode.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    console.log('Updated content result:', updatedContent);
    
    return NextResponse.json(updatedContent);
    
  } catch (error) {
    console.error('PUT /api/content error:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete content node
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing content ID' },
        { status: 400 }
      );
    }
    
    // Check if content has children
    const hasChildren = await ContentNode.findOne({ parentId: id });
    if (hasChildren) {
      return NextResponse.json(
        { error: 'Cannot delete content that has children' },
        { status: 400 }
      );
    }
    
    const deletedContent = await ContentNode.findByIdAndDelete(id);
    
    if (!deletedContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Content deleted successfully' });
    
  } catch (error) {
    console.error('DELETE /api/content error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}

// Helper function to build full path for a node
async function buildNodePath(node: { slug: string; parentId?: string | null }): Promise<string[]> {
  const path: string[] = [];
  let currentNode: { slug: string; parentId?: string | null } | null = node;
  
  // Build path by traversing up the parent chain
  while (currentNode) {
    path.unshift(currentNode.slug);
    
    if (currentNode.parentId) {
      const parentNode: { slug: string; parentId?: string | null } | null = await ContentNode.findById(currentNode.parentId);
      currentNode = parentNode;
    } else {
      break;
    }
  }
  
  return path;
}
