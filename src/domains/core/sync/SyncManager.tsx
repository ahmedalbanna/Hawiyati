import React, { useState, useEffect, useCallback } from "react";
import { CloudOff, Cloud, AlertTriangle, CheckCircle, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";

interface SyncTask {
  id: string;
  data: any;
  status: "pending" | "syncing" | "failed";
  timestamp: number;
}

export const useSyncManager = (onSyncComplete: () => void) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<SyncTask[]>(() => {
    const saved = localStorage.getItem("hawiyati_sync_queue");
    return saved ? JSON.parse(saved) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("hawiyati_sync_queue", JSON.stringify(queue));
  }, [queue]);

  const addToQueue = (data: any) => {
    const newTask: SyncTask = {
      id: Math.random().toString(36).substring(7),
      data,
      status: "pending",
      timestamp: Date.now(),
    };
    setQueue(prev => [...prev, newTask]);
  };

  const processSync = useCallback(async () => {
    if (!isOnline || queue.length === 0 || isSyncing) return;

    setIsSyncing(true);
    const tasksToProcess = queue.filter(t => t.status !== "syncing");
    
    for (const task of tasksToProcess) {
      try {
        const response = await fetch("/api/citizens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task.data),
        });

        if (response.ok) {
          setQueue(prev => prev.filter(t => t.id !== task.id));
        } else {
          // Conflict Resolution: If server returns error, mark as failed for manual review
           setQueue(prev => prev.map(t => t.id === task.id ? { ...t, status: "failed" } : t));
        }
      } catch (err) {
        console.error("Sync failed for task", task.id, err);
      }
    }
    
    setIsSyncing(false);
    onSyncComplete();
  }, [isOnline, queue, isSyncing, onSyncComplete]);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      const timer = setTimeout(processSync, 2000); // Debounce sync
      return () => clearTimeout(timer);
    }
  }, [isOnline, queue.length, processSync]);

  return { isOnline, queue, isSyncing, addToQueue, forceSync: processSync };
};

export const SyncStatusIndicator = ({ isOnline, queueLength, isSyncing }: { isOnline: boolean, queueLength: number, isSyncing: boolean }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-2xl glass-morphism border border-white/5">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Cloud className="h-4 w-4 text-emerald-500" />
        ) : (
          <CloudOff className="h-4 w-4 text-red-500" />
        )}
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", isOnline ? "text-emerald-500" : "text-red-500")}>
          {isOnline ? "متصل / Online" : "غير متصل / Offline"}
        </span>
      </div>

      <div className="h-4 w-px bg-white/10" />

      <div className="flex items-center gap-2">
        <div className="relative">
          {isSyncing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="absolute inset-0"
            >
              <RefreshCcw className="h-4 w-4 text-[#D4AF37]" />
            </motion.div>
          )}
          <RefreshCcw className={cn("h-4 w-4 text-white/20", isSyncing && "opacity-0")} />
        </div>
        <span className="text-[10px] font-mono text-[#D4AF37]">
          {queueLength} Pending
        </span>
      </div>
    </div>
  );
};
