import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileText, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JournalReflection {
  id: string;
  entry: string;
  mood: string;
  reflection: string;
  timestamp: Date;
}

interface ExportImportControlsProps {
  reflections: JournalReflection[];
  onImport: (reflections: JournalReflection[]) => void;
}

export const ExportImportControls: React.FC<ExportImportControlsProps> = ({
  reflections,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const exportToJSON = () => {
    try {
      const dataStr = JSON.stringify(reflections, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-reflections-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${reflections.length} reflections to JSON.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your reflections.",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = async () => {
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Journal Reflections</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 40px; }
            .reflection { margin-bottom: 30px; padding: 20px; border-left: 4px solid #8B5CF6; background: #F9FAFB; }
            .reflection-meta { color: #6B7280; font-size: 14px; margin-bottom: 10px; }
            .reflection-entry { margin-bottom: 15px; font-style: italic; }
            .reflection-ai { color: #374151; }
            .page-break { page-break-before: always; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>My Journal Reflections</h1>
            <p>Exported on ${new Date().toLocaleDateString()}</p>
          </div>
          ${reflections.map((reflection, index) => `
            <div class="reflection ${index > 0 && index % 3 === 0 ? 'page-break' : ''}">
              <div class="reflection-meta">
                ${new Date(reflection.timestamp).toLocaleDateString()} • Mood: ${reflection.mood}
              </div>
              <div class="reflection-entry">
                <strong>My thoughts:</strong><br>
                ${reflection.entry.replace(/\n/g, '<br>')}
              </div>
              <div class="reflection-ai">
                <strong>AI Reflection:</strong><br>
                ${reflection.reflection.replace(/\n/g, '<br>')}
              </div>
            </div>
          `).join('')}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-reflections-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${reflections.length} reflections to HTML (can be printed as PDF).`,
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your reflections to PDF.",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "Invalid File",
        description: "Please select a valid JSON file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedReflections = JSON.parse(content);
        
        // Validate structure
        if (!Array.isArray(importedReflections)) {
          throw new Error('Invalid file format');
        }

        const validReflections = importedReflections.map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp)
        }));

        onImport(validReflections);
        
        toast({
          title: "Import Successful",
          description: `Imported ${validReflections.length} reflections.`,
        });
      } catch (error) {
        console.error('Import failed:', error);
        toast({
          title: "Import Failed",
          description: "Failed to import reflections. Please check the file format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export & Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={exportToJSON}
            disabled={reflections.length === 0}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileJson className="h-4 w-4" />
            Export JSON
          </Button>
          
          <Button
            onClick={exportToPDF}
            disabled={reflections.length === 0}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export HTML/PDF
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import JSON
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        
        <p className="text-xs text-muted-foreground">
          Export your reflections as JSON or HTML (printable as PDF). Import previously exported JSON files.
        </p>
      </CardContent>
    </Card>
  );
};
