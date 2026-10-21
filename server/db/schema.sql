-- Future PostgreSQL adapter. No database is needed by the demo.
CREATE TABLE sheets (id text PRIMARY KEY, project text NOT NULL, geometry jsonb NOT NULL);
CREATE TABLE rooms (id text PRIMARY KEY, sheet_id text NOT NULL REFERENCES sheets(id), name text NOT NULL, polygon jsonb NOT NULL, metadata jsonb NOT NULL DEFAULT '{}');
CREATE TABLE catalog_items (sku text PRIMARY KEY, description text NOT NULL, unit_price numeric(12,2) NOT NULL CHECK (unit_price >= 0), labor_hours numeric(8,2) NOT NULL, metadata jsonb NOT NULL);
CREATE TABLE devices (id text PRIMARY KEY, sheet_id text NOT NULL REFERENCES sheets(id), room_id text REFERENCES rooms(id), sku text NOT NULL REFERENCES catalog_items(sku), x double precision NOT NULL, y double precision NOT NULL, type text NOT NULL CHECK (type IN ('smoke','heat')), listed_spacing_ft double precision NOT NULL CHECK (listed_spacing_ft > 0), source text NOT NULL CHECK (source IN ('ai','manual','autofix')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE device_events (id bigserial PRIMARY KEY, sheet_id text NOT NULL REFERENCES sheets(id), before_devices jsonb NOT NULL, after_devices jsonb NOT NULL, undone_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX device_sheet_idx ON devices(sheet_id);
CREATE INDEX event_undo_idx ON device_events(sheet_id, id DESC) WHERE undone_at IS NULL;
