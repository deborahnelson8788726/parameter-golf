# Single static service for Railway:
#   /         -> Agentic OS dashboard (command center)
#   /trinity/ -> Trinity MCP services landing page
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY agentic-os/dashboard/ /srv/
COPY trinity-mcp/site/ /srv/trinity/

# Railway injects PORT; Caddyfile binds to it.
EXPOSE 8080
