# ベースイメージ
FROM python:3.12-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なビルドツールをインストール
RUN apt-get update && apt-get install -y gcc python3-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 必要なパッケージをインストール
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# Flaskを環境変数で設定
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Flaskのデバッグモードを有効化
ENV FLASK_DEBUG=1

# デフォルトのコマンド
CMD ["flask", "run"]