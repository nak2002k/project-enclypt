// src/components/DashboardTable.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export function DashboardTable({
  files,
  onShowKey,
}: {
  files: {
    filename: string;
    size: number;
    method: string;
    timestamp: string;
  }[];
  onShowKey: () => void;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Size (KB)</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>When</TableHead>
            <TableHead>Key</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((f, i) => (
            <TableRow key={i} className="hover:bg-gray-50">
              <TableCell>{f.filename}</TableCell>
              <TableCell>{(f.size / 1024).toFixed(1)}</TableCell>
              <TableCell className="capitalize">{f.method}</TableCell>
              <TableCell>{new Date(f.timestamp).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onShowKey}
                  title="Show key"
                >
                  <IconEye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
