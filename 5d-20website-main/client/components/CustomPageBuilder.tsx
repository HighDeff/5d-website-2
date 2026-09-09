import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Grid,
  Move,
  Copy,
  Trash2,
  Save,
  Eye,
  Settings,
  Package,
  Tag,
  Image,
  Video,
  Type,
  MousePointer,
  Layout,
  Undo,
  Redo,
  Download,
  Upload,
} from "lucide-react";
import {
  customPageBuilderAI,
  DraggableCard,
  CustomPage,
} from "../services/CustomPageBuilderAI";
import { useUserAuth } from "@/hooks/useUserAuth";

interface CustomPageBuilderProps {
  userId: string;
  membershipLevel: string;
}

const CustomPageBuilder: React.FC<CustomPageBuilderProps> = ({
  userId,
  membershipLevel,
}) => {
  const { allProducts } = useUserAuth();
  const [currentPage, setCurrentPage] = useState<CustomPage | null>(null);
  const [userPages, setUserPages] = useState<CustomPage[]>([]);
  const [selectedCard, setSelectedCard] = useState<DraggableCard | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [availableComponents, setAvailableComponents] = useState<any>({});

  const canvasRef = useRef<HTMLDivElement>(null);
  const [newPageName, setNewPageName] = useState("");

  useEffect(() => {
    loadUserPages();
    loadAvailableComponents();
  }, [userId]);

  const loadUserPages = () => {
    const pages = customPageBuilderAI.getUserPages(userId, membershipLevel);
    setUserPages(pages);
    if (pages.length > 0 && !currentPage) {
      setCurrentPage(pages[0]);
    }
  };

  const loadAvailableComponents = () => {
    const components = customPageBuilderAI.getSelectableComponents();
    setAvailableComponents(components);
  };

  const createNewPage = () => {
    if (!newPageName.trim()) return;

    const membershipReq =
      membershipLevel === "premium"
        ? "premium"
        : membershipLevel === "member"
          ? "member"
          : "free";

    const page = customPageBuilderAI.createCustomPage(
      userId,
      newPageName,
      membershipReq as "free" | "member" | "premium",
    );

    setCurrentPage(page);
    setNewPageName("");
    loadUserPages();
  };

  const addCardToPage = (type: DraggableCard["type"], content: any) => {
    if (!currentPage) return;

    const position = { x: 50, y: 50 + currentPage.cards.length * 20 };
    const card = customPageBuilderAI.addCard(
      currentPage.id,
      type,
      content,
      position,
    );

    // Update current page
    const updatedPage = { ...currentPage };
    updatedPage.cards.push(card);
    setCurrentPage(updatedPage);
  };

  const handleCardMouseDown = (e: React.MouseEvent, card: DraggableCard) => {
    if (isPreviewMode) return;

    e.preventDefault();
    setSelectedCard(card);
    setIsDragging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !selectedCard || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - canvasRect.left - dragOffset.x,
        y: e.clientY - canvasRect.top - dragOffset.y,
      };

      // Update card position
      customPageBuilderAI.moveCard(
        currentPage!.id,
        selectedCard.id,
        newPosition,
      );

      // Update local state
      if (currentPage) {
        const updatedPage = { ...currentPage };
        const cardIndex = updatedPage.cards.findIndex(
          (c) => c.id === selectedCard.id,
        );
        if (cardIndex >= 0) {
          updatedPage.cards[cardIndex].position = newPosition;
          setCurrentPage(updatedPage);
        }
      }
    },
    [isDragging, selectedCard, dragOffset, currentPage],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelectedCard(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const copyCard = (card: DraggableCard) => {
    if (!currentPage) return;

    const newCardId = customPageBuilderAI.copyCard(currentPage.id, card.id);
    if (newCardId) {
      loadUserPages();
      // Refresh current page
      const updatedPages = customPageBuilderAI.getUserPages(
        userId,
        membershipLevel,
      );
      const updated = updatedPages.find((p) => p.id === currentPage.id);
      if (updated) setCurrentPage(updated);
    }
  };

  const deleteCard = (cardId: string) => {
    if (!currentPage) return;

    const updatedPage = { ...currentPage };
    updatedPage.cards = updatedPage.cards.filter((c) => c.id !== cardId);
    setCurrentPage(updatedPage);

    // Note: In production, you'd also call a delete method on the AI service
  };

  const renderCard = (card: DraggableCard) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: card.position.x,
      top: card.position.y,
      width: card.size.width,
      height: card.size.height,
      cursor: isPreviewMode ? "default" : "move",
      border:
        selectedCard?.id === card.id
          ? "2px solid #3b82f6"
          : "1px solid #e5e7eb",
      borderRadius: "8px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "8px",
      overflow: "hidden",
    };

    let cardContent;
    switch (card.type) {
      case "product":
        cardContent = (
          <div className="h-full flex flex-col">
            <img
              src={card.content.image}
              alt={card.content.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h4 className="font-semibold text-sm truncate">
              {card.content.name}
            </h4>
            <p className="text-purple-600 font-bold">${card.content.price}</p>
            <Badge className="text-xs mt-1">{card.content.category}</Badge>
          </div>
        );
        break;

      case "category":
        cardContent = (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-2xl mb-2">{card.content.icon || "📦"}</div>
            <h4 className="font-semibold text-center">
              {card.content.categoryName}
            </h4>
            <p className="text-sm text-gray-500">
              {card.content.products?.length || 0} items
            </p>
          </div>
        );
        break;

      case "button":
        cardContent = (
          <Button
            className="w-full h-full"
            variant={card.content.style === "primary" ? "default" : "outline"}
          >
            {card.content.text}
          </Button>
        );
        break;

      case "text":
        cardContent = (
          <div className="h-full overflow-auto">
            <p className="text-sm">{card.content.content}</p>
          </div>
        );
        break;

      case "image":
        cardContent = (
          <div className="h-full">
            <img
              src={card.content.src}
              alt={card.content.alt}
              className="w-full h-full object-cover rounded"
            />
          </div>
        );
        break;

      default:
        cardContent = (
          <div className="h-full flex items-center justify-center text-gray-500">
            Unknown card type
          </div>
        );
    }

    return (
      <div
        key={card.id}
        style={style}
        onMouseDown={(e) => handleCardMouseDown(e, card)}
        data-card-id={card.id}
        className="draggable-card group"
      >
        {cardContent}

        {/* Card Controls */}
        {!isPreviewMode && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                copyCard(card);
              }}
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                deleteCard(card.id);
              }}
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const exportPage = () => {
    if (!currentPage) return;

    const exportData = {
      page: currentPage,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentPage.name.replace(/\s+/g, "-")}-page.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            Page Builder
          </h2>
          <Badge variant="outline" className="mt-1">
            {membershipLevel.toUpperCase()}
          </Badge>
        </div>

        {/* Page Selection */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2 mb-3">
            <Input
              placeholder="New page name"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={createNewPage}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {userPages.map((page) => (
              <Button
                key={page.id}
                variant={currentPage?.id === page.id ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setCurrentPage(page)}
              >
                {page.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Component Library */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="products">
                <Package className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Tag className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="media">
                <Image className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="elements">
                <Type className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="p-4 space-y-2">
              <h4 className="font-medium text-sm mb-2">Products</h4>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {availableComponents.products
                  ?.slice(0, 10)
                  .map((product: any) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => addCardToPage("product", product)}
                    >
                      <Package className="w-3 h-3 mr-2" />
                      {product.name}
                    </Button>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="p-4 space-y-2">
              <h4 className="font-medium text-sm mb-2">Categories</h4>
              <div className="space-y-1">
                {availableComponents.categories?.map((category: any) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => addCardToPage("category", category)}
                  >
                    <Tag className="w-3 h-3 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="media" className="p-4 space-y-2">
              <h4 className="font-medium text-sm mb-2">Media</h4>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() =>
                    addCardToPage("image", {
                      src: "https://via.placeholder.com/300x200",
                      alt: "Placeholder",
                    })
                  }
                >
                  <Image className="w-3 h-3 mr-2" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() =>
                    addCardToPage("video", {
                      src: "",
                      thumbnail: "https://via.placeholder.com/300x200",
                    })
                  }
                >
                  <Video className="w-3 h-3 mr-2" />
                  Video
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="elements" className="p-4 space-y-2">
              <h4 className="font-medium text-sm mb-2">Elements</h4>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() =>
                    addCardToPage("text", {
                      content: "Your text here",
                      format: "paragraph",
                    })
                  }
                >
                  <Type className="w-3 h-3 mr-2" />
                  Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() =>
                    addCardToPage("button", {
                      text: "Click Me",
                      action: "navigate",
                      target: "/",
                    })
                  }
                >
                  <MousePointer className="w-3 h-3 mr-2" />
                  Button
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreviewMode ? "outline" : "default"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>

            <Button variant="outline" size="sm">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportPage}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 overflow-auto">
          {currentPage ? (
            <div
              ref={canvasRef}
              className="relative bg-white rounded-lg shadow-sm border min-h-[600px] w-full"
              style={{ minWidth: "800px" }}
            >
              {currentPage.cards.map((card) => renderCard(card))}

              {/* Drop Zone Indicator */}
              {!isPreviewMode && currentPage.cards.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Grid className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Drop components here</p>
                    <p className="text-sm">
                      Select components from the sidebar to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Layout className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">
                  No page selected
                </p>
                <p className="text-sm text-gray-500">
                  Create a new page to start building
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPageBuilder;
