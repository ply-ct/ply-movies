import * as http from 'http';
import { WebSocket, WebSocketServer, RawData } from 'ws';
import { MovieUpdate, MovieUpdateListener } from './service';

export interface WebSocketRequest {
    method: string;
    url: string;
    headers: { [key: string ]: string };
}

export class WsServer implements MovieUpdateListener{
    private webSocketServer: WebSocketServer;
    private subscribers = new Map<string, WebSocket>();

    constructor(server: http.Server) {
        this.webSocketServer = new WebSocketServer({ noServer: true });

        this.webSocketServer.on(
            'connection',
            (ws: WebSocket, req: WebSocketRequest) => {
                if (req.url !== '/updates') {
                    ws.close(4000, `Invalid path: ${req.url}`);
                    return;
                }

                const id = this.genId();
                this.subscribers.set(id, ws);
                ws.on('message', async (data: RawData, _isBinary: boolean) => {
                    // not in the business of handling messages
                    console.debug(`Received websocket message:`, data.toString());
                });
                ws.on('error', (err: unknown) => {
                    console.error(`WebSocket error: ${err}`, err);
                });
                ws.on('close', (code: number, reason: string) => {
                    console.debug(`WebSocket closed on: ${code} ${reason}`);
                    this.subscribers.delete(id);
                });
            }
        );

        server.on('upgrade', async (req, socket, headers) => {
            this.webSocketServer.handleUpgrade(req, socket, headers, (ws) => {
                this.webSocketServer.emit('connection', ws, req);
            });
        });
    }

    onMovieUpdate(update: MovieUpdate) {
        for (const ws of this.subscribers.values()) {
            ws.send(JSON.stringify(update));
        }
    }

    genId(): string {
        return Date.now().toString(16) + process.hrtime.bigint().toString(16);
    }
}
