from PIL import Image, ImageDraw, ImageFont
import qrcode
import os
from datetime import datetime
import textwrap

def generate_id_card(employee_data):
    name = employee_data.get("name", "Unknown")
    ref_id = employee_data.get("_id", "N/A")
    photo_path = employee_data.get("photoOfPerson", None)
    qr_data = employee_data.get("qr_data", ref_id)
    address = employee_data.get("address", "N/A")
    phoneNumber = employee_data.get("phoneNumber", "N/A")
    dateJoined = employee_data.get("dateJoined", "N/A")
    company = employee_data.get("company", "N/A")

    card_width, card_height = 600, 400
    background_color = (255, 255, 255)

    card = Image.new("RGB", (card_width, card_height), background_color)
    draw = ImageDraw.Draw(card)

    font_path = "arial.ttf"
    name_font = ImageFont.truetype(font_path, size=30)
    ref_id_font = ImageFont.truetype(font_path, size=20)

    border_color = (0, 0, 0)
    border_width = 10
    draw.rectangle(
        [(border_width, border_width), (card_width - border_width, card_height - border_width)],
        outline=border_color,
        width=border_width,
    )

    if photo_path:
        try:
            photo = Image.open(photo_path).resize((200, 200))
            card.paste(photo, (50, 40))
        except Exception as e:
            print(f"Error loading photo: {e}")

    draw.text((50, 250), f"{name}", fill="black", font=name_font)
    draw.text((300, 50), f"Ref ID: {ref_id}", fill="black", font=ref_id_font)
    # draw.text((180, 140), address, fill="black", font=ref_id_font)
    address_lines = textwrap.wrap(address, width=30)
    y_text = 170
    for line in address_lines:
        draw.text((300, y_text), f"{line}", fill="black", font=ref_id_font)
        y_text += ref_id_font.size + 5
    draw.text((300, 90), f"Phone: {phoneNumber}", fill="black", font=ref_id_font)
    draw.text((300, 130), f"Date Joined: {dateJoined}", fill="black", font=ref_id_font)
    draw.text((50, 300), f"{company}", fill="black", font=ref_id_font)

    qr = qrcode.QRCode(box_size=4, border=2)
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr_code_img = qr.make_image(fill="black", back_color="white").resize((100, 100))
    card.paste(qr_code_img, (450, 250))

    directory = 'Server/EmployeeIDs/'
    if not os.path.exists(directory):
        os.makedirs(directory)

    output_path = os.path.join(directory, f"{employee['name'].replace(' ', '_')}_id_card.png")

    card.save(output_path)
    print(f"ID card saved to {output_path}")



employee = {
    "_id": "EMP1001",
    "name": "Michael Flores",
    "address": "123 Main Street, Cebu City, Philippines",
    "phoneNumber": "+63 912 345 6789",
    "photoOfPerson": "server/test_assets/minor.png",
    "resumePhotosList": ["resume_page1.jpg", "resume_page2.jpg"],
    "biodataPhotosList": ["biodata_page1.jpg"],
    "email": "michael.flores@example.com",
    "dateJoined": datetime(2024, 1, 15).date(),
    "company": "Pustanan Printers",
    "isRegular": True,
    "isProductionEmployee": False,
    "isOJT": False,
    "dailyWage": 800.50,
    "_version": 1,
}

generate_id_card(employee)

