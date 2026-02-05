import psycopg2
host = "db.yuemlsjtzdpgclgnlogg.supabase.co"

for port in (6543, 5432):  # pooled first, then direct
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            user="postgres",
            password="Ddugiborn@2001",  # use your current DB password
            dbname="postgres",
            sslmode="require",
            connect_timeout=5,
        )
        with conn.cursor() as cur:
            cur.execute("SELECT version()")
            print(port, "OK:", cur.fetchone()[0])
        conn.close()
    except Exception as e:
        print(port, "ERROR:", e)