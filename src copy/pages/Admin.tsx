import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Save, X, FileText, Folder, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { mockData } from '@/data/mockData';
import { ContentNode } from '@/types/content';
import { useToast } from '@/hooks/use-toast';

type EditingNode = Partial<ContentNode> & {
  isNew?: boolean;
  parentId?: string;
};

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('categories');
  const [editingNode, setEditingNode] = useState<EditingNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data management (in real app, this would be API calls)
  const [contentData, setContentData] = useState(mockData);

  const flattenContent = (nodes: ContentNode[], level = 0): (ContentNode & { level: number })[] => {
    const result: (ContentNode & { level: number })[] = [];
    
    nodes.forEach(node => {
      result.push({ ...node, level });
      if (node.children) {
        result.push(...flattenContent(node.children, level + 1));
      }
    });
    
    return result;
  };

  const filteredContent = flattenContent(contentData).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      (selectedTab === 'categories' && item.type === 'category') ||
      (selectedTab === 'chapters' && item.type === 'chapter') ||
      (selectedTab === 'articles' && item.type === 'article') ||
      selectedTab === 'all';
    
    return matchesSearch && matchesTab;
  });

  const handleEdit = (node: ContentNode) => {
    setEditingNode({ ...node });
    setIsDialogOpen(true);
  };

  const handleCreate = (type: 'category' | 'chapter' | 'article') => {
    setEditingNode({
      isNew: true,
      type,
      title: '',
      summary: '',
      slug: '',
      body: type === 'article' ? '' : undefined,
      author: type === 'article' ? '' : undefined,
      badge: type !== 'category' ? 1 : undefined
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingNode) return;
    
    // Mock save operation
    toast({
      title: editingNode.isNew ? 'Content Created' : 'Content Updated',
      description: `${editingNode.title} has been ${editingNode.isNew ? 'created' : 'updated'} successfully.`
    });
    
    setIsDialogOpen(false);
    setEditingNode(null);
  };

  const handleDelete = (node: ContentNode) => {
    // Mock delete operation
    toast({
      title: 'Content Deleted',
      description: `${node.title} has been deleted successfully.`,
      variant: 'destructive'
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'category': return <BookOpen className="h-4 w-4" />;
      case 'chapter': return <Folder className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'category': return 'bg-blue-500/20 text-blue-700';
      case 'chapter': return 'bg-green-500/20 text-green-700';
      case 'article': return 'bg-purple-500/20 text-purple-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
              <p className="text-muted-foreground">Manage categories, chapters, and articles</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => handleCreate('category')} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
              <Button onClick={() => handleCreate('chapter')} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Chapter
              </Button>
              <Button onClick={() => handleCreate('article')} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="chapters">Chapters</TabsTrigger>
                    <TabsTrigger value="articles">Articles</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredContent.length} items found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content found matching your criteria
                </div>
              ) : (
                filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    style={{ marginLeft: `${item.level * 24}px` }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getIcon(item.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <Badge className={getTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                          {item.badge === 'coming-soon' && (
                            <Badge variant="secondary">Coming Soon</Badge>
                          )}
                          {typeof item.badge === 'number' && (
                            <Badge variant="destructive">{item.badge}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.summary || 'No summary provided'}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>ID: {item.id}</span>
                          <span>Slug: {item.slug}</span>
                          {item.author && <span>Author: {item.author}</span>}
                          {item.createdAt && <span>Created: {item.createdAt}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNode?.isNew ? 'Create' : 'Edit'} {editingNode?.type}
            </DialogTitle>
          </DialogHeader>
          
          {editingNode && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingNode.title || ''}
                    onChange={(e) => setEditingNode({ ...editingNode, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={editingNode.slug || ''}
                    onChange={(e) => setEditingNode({ ...editingNode, slug: e.target.value })}
                    placeholder="enter-slug"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={editingNode.summary || ''}
                  onChange={(e) => setEditingNode({ ...editingNode, summary: e.target.value })}
                  placeholder="Enter summary"
                  rows={3}
                />
              </div>

              {editingNode.type !== 'category' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="badge">Badge</Label>
                    <Select
                      value={editingNode.badge?.toString() || ''}
                      onValueChange={(value) => 
                        setEditingNode({ 
                          ...editingNode, 
                          badge: value === 'coming-soon' ? 'coming-soon' : parseInt(value) 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select badge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="coming-soon">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {editingNode.type === 'article' && (
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={editingNode.author || ''}
                        onChange={(e) => setEditingNode({ ...editingNode, author: e.target.value })}
                        placeholder="Enter author name"
                      />
                    </div>
                  )}
                </div>
              )}

              {editingNode.type === 'article' && (
                <div>
                  <Label htmlFor="body">Content Body</Label>
                  <Textarea
                    id="body"
                    value={editingNode.body || ''}
                    onChange={(e) => setEditingNode({ ...editingNode, body: e.target.value })}
                    placeholder="Enter article content (Markdown supported)"
                    rows={8}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingNode.isNew ? 'Create' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}