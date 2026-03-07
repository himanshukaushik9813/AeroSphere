'use client';

/**
 * useWebSocket - Custom hook for WebSocket real-time weather updates.
 */
import { useEffect, useRef, useState, useCallback } from 'react';

interface WSMessage {
    type: string;
    data?: unknown;
    message?: string;
    timestamp?: number;
}

interface UseWebSocketOptions {
    onWeatherUpdate?: (data: { weather: unknown; aqi: unknown }) => void;
    reconnectInterval?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
    const { onWeatherUpdate, reconnectInterval = 5000 } = options;
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<NodeJS.Timeout>();
    const manuallyDisconnectedRef = useRef(false);
    const lastSubscriptionRef = useRef<{ lat: number; lon: number } | null>(null);
    const [connected, setConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);

    const connect = useCallback(() => {
        manuallyDisconnectedRef.current = false;
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws';

        try {
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[WS] Connected');
                setConnected(true);

                if (lastSubscriptionRef.current) {
                    ws.send(
                        JSON.stringify({
                            type: 'subscribe',
                            ...lastSubscriptionRef.current,
                        })
                    );
                }
            };

            ws.onmessage = (event) => {
                try {
                    const message: WSMessage = JSON.parse(event.data);

                    if (message.type === 'weather_update' && onWeatherUpdate) {
                        onWeatherUpdate(message.data as { weather: unknown; aqi: unknown });
                        setLastUpdate(message.timestamp || Date.now());
                    }
                } catch (err) {
                    console.error('[WS] Parse error:', err);
                }
            };

            ws.onclose = () => {
                console.log('[WS] Disconnected');
                setConnected(false);
                wsRef.current = null;

                if (!manuallyDisconnectedRef.current) {
                    reconnectTimerRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                }
            };

            ws.onerror = (err) => {
                console.error('[WS] Error:', err);
                ws.close();
            };
        } catch (err) {
            console.error('[WS] Connection failed:', err);
            reconnectTimerRef.current = setTimeout(connect, reconnectInterval);
        }
    }, [onWeatherUpdate, reconnectInterval]);

    const subscribe = useCallback((lat: number, lon: number) => {
        lastSubscriptionRef.current = { lat, lon };

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({ type: 'subscribe', lat, lon })
            );
        }
    }, []);

    const unsubscribe = useCallback(() => {
        lastSubscriptionRef.current = null;

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'unsubscribe' }));
        }
    }, []);

    const disconnect = useCallback(() => {
        manuallyDisconnectedRef.current = true;
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        connected,
        lastUpdate,
        subscribe,
        unsubscribe,
        disconnect,
    };
}
