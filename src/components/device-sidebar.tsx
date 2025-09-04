import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Device } from "@/types";
import { Smartphone, Tablet } from "lucide-react";

interface DeviceSidebarProps {
  devices: Device[];
}

export function DeviceSidebar({ devices }: DeviceSidebarProps) {
  const getStatusBadge = (status: Device["status"]) => {
    return (
      <Badge variant={status === "idle" ? "default" : "secondary"}>
        {status === "idle" ? "Idle" : "Busy"}
      </Badge>
    );
  };

  const getDeviceIcon = (platform: Device["platform"]) => {
    return platform === "iOS" ? 
      <Smartphone className="h-4 w-4" /> : 
      <Tablet className="h-4 w-4" />;
  };

  const groupedDevices = devices.reduce((acc, device) => {
    if (!acc[device.platform]) {
      acc[device.platform] = [];
    }
    acc[device.platform].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

  return (
    <div className="w-64 border-l bg-gray-50 p-4 h-full">
      <h3 className="font-semibold mb-4">Device Registry</h3>
      
      <div className="space-y-4">
        {Object.entries(groupedDevices).map(([platform, platformDevices]) => (
          <Card key={platform}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {getDeviceIcon(platform as Device["platform"])}
                {platform} Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {platformDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between py-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{device.name}</p>
                    <p className="text-xs text-muted-foreground">v{device.osVersion}</p>
                  </div>
                  {getStatusBadge(device.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Devices:</span>
            <span className="font-medium">{devices.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Available:</span>
            <span className="font-medium text-green-600">
              {devices.filter(d => d.status === "idle").length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">In Use:</span>
            <span className="font-medium text-yellow-600">
              {devices.filter(d => d.status === "busy").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}