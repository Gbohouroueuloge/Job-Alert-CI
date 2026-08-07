from __future__ import annotations

from db.session import init_db


if __name__ == "__main__":
    init_db()
    print("Schema cree depuis les modeles SQLAlchemy.")
