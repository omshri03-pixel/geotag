"use client";

import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud, X, FileImage, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as ExifReader from "exifreader";
export interface FileWithMeta {
  file: File;
  id: string;
  hasGPS: boolean | null;
  status: 'pending' | 'processing' | 'success' | 'failed';
  errorMessage?: string;
  customLat?: number;
  customLng?: number;
  customBusiness?: string;
  customKeywords?: string;
  customAlt?: string;
}

interface UploadZoneProps {
  files: FileWithMeta[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithMeta[]>>;
  onSelectFile: (file: FileWithMeta) => void;
}

export default function UploadZone({ files, setFiles, onSelectFile }: UploadZoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      alert("Some files were rejected. Please ensure they are JPG/JPEG/PNG and under 25MB.");
    }
    
    // Process files async to read metadata
    const newFilesWithMeta: FileWithMeta[] = await Promise.all(acceptedFiles.map(async (file) => {
      let hasGPS = null;
      try {
        const tags = await ExifReader.load(file);
        hasGPS = !!(tags.GPSLatitude && tags.GPSLongitude);
      } catch (err) {
        console.warn("Could not read EXIF data for", file.name, err);
      }
      
      return {
        file,
        id: Math.random().toString(36).substring(7),
        hasGPS,
        status: 'pending'
      };
    }));

    setFiles((prev) => [...prev, ...newFilesWithMeta]);
  }, [setFiles]);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    maxSize: 25 * 1024 * 1024 // 25MB max
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[160px]
          ${isDragActive ? "border-brand bg-brand/10" : "border-border hover:border-brand/50 hover:bg-bg-panel"}`}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center shadow-sm mb-4 border border-border">
          <UploadCloud className="w-6 h-6 text-brand" />
        </div>
        <p className="font-medium text-sm">
          {isDragActive ? "Drop images here" : "Drag & drop images, or click to browse"}
        </p>
        <p className="text-xs text-text-muted mt-2">
          Supports JPG, JPEG, PNG (Max 25MB, up to 100 files)
        </p>
      </div>

      {files.length > 0 && (
        <div className="bg-bg-panel border border-border rounded-lg max-h-48 overflow-y-auto p-2 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <AnimatePresence>
              {files.map((f, i) => (
                <motion.div
                  key={`${f.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => onSelectFile(f)}
                  className="flex flex-col bg-bg rounded-md p-3 text-sm border border-border/50 group cursor-pointer hover:border-brand/40 hover:bg-bg-panel/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between overflow-hidden mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileImage className="w-4 h-4 text-brand flex-shrink-0" />
                      <span className="truncate text-xs font-medium">{f.file.name}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="p-1 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    {f.hasGPS ? (
                      <span className="text-brand flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> GPS Exists</span>
                    ) : (
                      <span className="text-text-muted flex items-center gap-1"><AlertCircle className="w-3 h-3" /> No GPS Found</span>
                    )}
                    
                    {f.status === 'success' && <span className="text-green-500 font-medium">Done</span>}
                    {f.status === 'failed' && <span className="text-red-500 font-medium truncate max-w-[60px]" title={f.errorMessage}>{f.errorMessage}</span>}
                    {f.status === 'processing' && <span className="text-brand font-medium">Processing...</span>}
                    {f.status === 'pending' && <span className="text-text-muted">Pending</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
