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
    isRegular = employee_data.get("isRegular", False)
    isProductionEmployee = employee_data.get("isProductionEmployee", False)
    isOJT = employee_data.get("isOJT", False)

    card_width, card_height = 591, 1004
    background_color = (255, 255, 255)

    # card = Image.new("RGB", (card_width, card_height), background_color)
    # draw = ImageDraw.Draw(card)
    type_of_employee = "Regular Employee" if isRegular else "OJT" if isOJT else "Production Employee" if isProductionEmployee else "Unknown"

    background_path = "server/IDassets/"

    if company == "PPC":
        background_path += "ppcIDfront.png"
    if company == "BB":
        background_path += "bbIDfront.png"
    if company == "PPB":
        background_path += "ppbIDfront.png"
    if company == "SP":
        background_path += "spIDfront.png"

    try:
        background = Image.open(background_path).resize((card_width, card_height))
    except Exception as e:
        print(f"Error loading background image: {e}")
        return

    draw = ImageDraw.Draw(background)

    font_path = "arial.ttf"
    name_font = ImageFont.truetype(font_path, size=50)
    role_font = ImageFont.truetype(font_path, size=40)
    ref_id_font = ImageFont.truetype(font_path, size=30)

    border_color = (0, 0, 0)
    border_width = 10
    draw.rectangle(
        [(border_width, border_width), (card_width - border_width, card_height - border_width)],
        outline=border_color,
        width=border_width,
    )

    if photo_path:
        try:
            photo = Image.open(photo_path).resize((205, 200))
            background.paste(photo, (195, 260))
        except Exception as e:
            print(f"Error loading photo: {e}")

    draw.text((130, 530), f"{name}", fill="black", font=name_font)
    draw.text((255, 620), f"{type_of_employee}", fill="black", font=role_font)
    draw.text((180, 850), f"ID no.: {ref_id}", fill="black", font=ref_id_font)
    # draw.text((180, 140), address, fill="black", font=ref_id_font)
    # address_lines = textwrap.wrap(address, width=30)
    # y_text = 170
    # for line in address_lines:
    #     draw.text((300, y_text), f"{line}", fill="black", font=ref_id_font)
    #     y_text += ref_id_font.size + 5
    # draw.text((300, 90), f"Phone: {phoneNumber}", fill="black", font=ref_id_font)
    # draw.text((300, 130), f"Date Joined: {dateJoined}", fill="black", font=ref_id_font)
    # draw.text((50, 300), f"{company}", fill="black", font=ref_id_font)

    # qr = qrcode.QRCode(box_size=4, border=2)
    # qr.add_data(qr_data)
    # qr.make(fit=True)
    # qr_code_img = qr.make_image(fill="black", back_color="white").resize((100, 100))
    # background.paste(qr_code_img, (450, 250))

    directory = 'Server/EmployeeIDs/'
    if not os.path.exists(directory):
        os.makedirs(directory)

    output_path = os.path.join(directory, f"{employee['name'].replace(' ', '_')}_id_card.png")

    background.save(output_path)
    print(f"ID card saved to {output_path}")

    # back side of ID card

    # back = Image.new("RGB", (card_width, card_height), background_color)

    try:
        back = Image.open(background_path).resize((card_width, card_height))
    except Exception as e:
        print(f"Error loading background image: {e}")
        return

    draw_back = ImageDraw.Draw(back)
    terms_font = ImageFont.truetype(font_path, size=18)

    terms = "This card is the property of the company and must be returned upon request. " \

    terms_lines = textwrap.wrap(terms, width=60)
    y_text = 50
    for line in terms_lines:
        draw_back.text((50, y_text), line, fill="black", font=terms_font)
        y_text += terms_font.size + 5

    draw_back.text((50, 300), f"Property of {company}", fill="black", font=ref_id_font)

    # back_output_path = os.path.join(output_path, f"{name.replace(' ', '_')}_id_card_back.png")
    back_output_path = os.path.join(directory, f"{employee['name'].replace(' ', '_')}_id_card_back.png")
    back.save(back_output_path)
    print(f"Back side of ID card saved to {back_output_path}")



employee = {
    "_id": "EMP1001",
    "name": "Michael Val Letigio Flores",
    "address": "123 Main Street, Cebu City, Philippines",
    "phoneNumber": "+63 912 345 6789",
    "photoOfPerson": "server/test_assets/minor.png",
    "resumePhotosList": ["resume_page1.jpg", "resume_page2.jpg"],
    "biodataPhotosList": ["biodata_page1.jpg"],
    "email": "michael.flores@example.com",
    "dateJoined": datetime(2024, 1, 15).date(),
    "company": "SP",
    "isRegular": False,
    "isProductionEmployee": False,
    "isOJT": True,
    "dailyWage": 800.50,
    "_version": 1,
}

generate_id_card(employee)

