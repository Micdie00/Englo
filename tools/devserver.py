# Lokaler Testserver ohne Browser-Cache:  python tools/devserver.py  → http://localhost:5173
import http.server, functools, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class NoCache(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.webmanifest': 'application/manifest+json'}
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

http.server.ThreadingHTTPServer(('127.0.0.1', 5173), functools.partial(NoCache, directory=ROOT)).serve_forever()
