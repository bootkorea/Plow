import streamlit as st
from PIL import Image
from ultralytics import YOLO
import matplotlib.pyplot as plt

# Load a pre-trained YOLOv10n model
model = YOLO("yolov10n.pt")

# 이미지 업로드 기능
uploaded_file = st.file_uploader("이미지를 업로드하세요", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    # 이미지를 열고 표시
    image = Image.open(uploaded_file)

    # 객체 검출 수행
    results = model(image)

    # 결과 이미지 출력
    result_image = results[0].plot()  # 검출된 결과를 그린 이미지
    
    # Matplotlib를 사용해 결과 이미지를 표시
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.imshow(result_image)
    ax.axis("off")  # 축을 제거
    st.pyplot(fig)
else:
    st.write("이미지가 업로드되지 않았습니다.")
