schema:
  /opt/homebrew/opt/libpq/bin/pg_dump --schema-only --file=schema.sql postgresql://postgres:password@localhost:5432/gachapon

import-schema:
	\i schema.sql