import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findNodeByPath } from '@/lib/contentUtils';
import ArticleReader from '@/pages/ArticleReader';
import Explorer from '@/pages/Explorer';

export default function ArticleRouter() {
  const { categorySlug, '*': pathString } = useParams();
  const navigate = useNavigate();

  if (!categorySlug) {
    navigate('/');
    return null;
  }

  const pathArray = pathString ? pathString.split('/').filter(Boolean) : [];
  const fullPath = [categorySlug, ...pathArray];
  
  const node = findNodeByPath(fullPath);
  
  if (!node) {
    navigate('/');
    return null;
  }

  // If it's an article, show the reader
  if (node.type === 'article') {
    return <ArticleReader />;
  }

  // Otherwise, show the explorer
  return <Explorer />;
}
