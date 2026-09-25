-- Run as the postgres superuser, then:
--   psql -U postgres -h localhost -f scripts/setup-local-db.sql

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'shiftmycar') THEN
    CREATE ROLE shiftmycar LOGIN PASSWORD 'shiftmycar';
  ELSE
    ALTER ROLE shiftmycar WITH LOGIN PASSWORD 'shiftmycar';
  END IF;
END
$$;

SELECT 'CREATE DATABASE shiftmycar OWNER shiftmycar'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shiftmycar')\gexec

GRANT ALL PRIVILEGES ON DATABASE shiftmycar TO shiftmycar;
\c shiftmycar
GRANT ALL ON SCHEMA public TO shiftmycar;
ALTER SCHEMA public OWNER TO shiftmycar;
