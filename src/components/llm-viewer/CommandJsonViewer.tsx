"use client";

import { useState } from "react";
import { LLMCommand } from "@/lib/llm-command-data";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

interface CommandJsonViewerProps {
  command: LLMCommand;
  className?: string;
}

export function CommandJsonViewer({ command, className = "" }: CommandJsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const formatJson = (obj: any, indent = 2): string => {
    return JSON.stringify(obj, null, indent);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatJson(command));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "tap":
        return "text-blue-600";
      case "type":
        return "text-green-600";
      case "swipe":
        return "text-purple-600";
      case "wait":
        return "text-amber-600";
      case "assert":
        return "text-cyan-600";
      case "scroll":
        return "text-indigo-600";
      default:
        return "text-gray-600";
    }
  };

  const renderJsonLine = (line: string, index: number) => {
    const trimmed = line.trim();
    
    // Syntax highlighting
    if (trimmed.startsWith('"action"')) {
      return (
        <span key={index}>
          <span className="text-blue-700">"action"</span>
          <span>: </span>
          <span className={`font-medium ${getActionColor(command.action)}`}>
            "{command.action}"
          </span>
          {trimmed.endsWith(",") && ","}
        </span>
      );
    }
    
    if (trimmed.includes('"selector"') || trimmed.includes('"label"') || trimmed.includes('"elementId"')) {
      const parts = trimmed.split(":");
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join(":");
        return (
          <span key={index}>
            <span className="text-blue-700">{key}</span>
            <span>: </span>
            <span className="text-green-700">{value}</span>
          </span>
        );
      }
    }
    
    if (trimmed.includes('"x"') || trimmed.includes('"y"') || trimmed.includes('"duration"') || trimmed.includes('"distance"')) {
      const parts = trimmed.split(":");
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join(":");
        return (
          <span key={index}>
            <span className="text-blue-700">{key}</span>
            <span>: </span>
            <span className="text-amber-700">{value}</span>
          </span>
        );
      }
    }
    
    if (trimmed.includes('"text"')) {
      const parts = trimmed.split(":");
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join(":");
        return (
          <span key={index}>
            <span className="text-blue-700">{key}</span>
            <span>: </span>
            <span className="text-purple-700">{value}</span>
          </span>
        );
      }
    }
    
    if (trimmed === "{" || trimmed === "}" || trimmed === "},") {
      return <span key={index} className="text-gray-600">{line}</span>;
    }
    
    if (trimmed.includes('"target"') || trimmed.includes('"parameters"')) {
      const parts = trimmed.split(":");
      if (parts.length >= 2) {
        const key = parts[0];
        const value = parts.slice(1).join(":");
        return (
          <span key={index}>
            <span className="text-red-700">{key}</span>
            <span>: {value}</span>
          </span>
        );
      }
    }
    
    return <span key={index}>{line}</span>;
  };

  const jsonLines = formatJson(command).split('\n');

  return (
    <div className={`bg-gray-900 rounded-[var(--r-card)] overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          Command JSON
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-200">
            <code>
              {jsonLines.map((line, index) => (
                <div key={index}>
                  {renderJsonLine(line, index)}
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}