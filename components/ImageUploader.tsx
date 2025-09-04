'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ImageUploaderProps {
  onImageUpload: (file: File, preview: string) => void;
  isUploading?: boolean;
}

export default function ImageUploader({ onImageUpload, isUploading = false }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageUpload(file, result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upload Product Image</h3>
          {preview && (
            <Button variant="ghost" size="sm" onClick={clearImage}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {!preview ? (
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-white/40'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              
              <div>
                <p className="text-lg font-medium">
                  {isUploading ? 'Processing...' : 'Drop your image here'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  or click to browse your files
                </p>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP up to 10MB
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black/20 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Product preview"
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              <span>Image uploaded successfully</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
