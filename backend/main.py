from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tempfile
import os, tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],

)

@app.post("/api/convert")
async def convert_image(file: UploadFile = File(...), format: str = Form(...)):
    temp_dir = tempfile.gettempdir()
    input_path = os.path.join(temp_dir, file.filename)
    output_filename = f"converted.{format.lower()}"
    output_path = os.path.join(temp_dir, output_filename)


    with open(input_path, "wb") as f:
        f.write(await file.read())

    img = Image.open(input_path).convert("RGB")
    img.save(output_path, format=format.upper())
    os.remove(input_path)

    return FileResponse(output_path, filename=output_filename, media_type="application/octet-stream")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")

app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")