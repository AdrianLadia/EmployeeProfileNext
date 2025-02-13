from PIL import Image, ImageDraw, ImageFont
import os
from datetime import datetime
import time
from typing import Optional
import textwrap
from firebase_admin import credentials, storage, initialize_app, get_app, _apps
from pydantic import BaseModel, Field, field_validator
import requests
from io import BytesIO
from dotenv import load_dotenv
from barcode import Code128
from barcode.writer import ImageWriter

load_dotenv()

isTest = os.getenv("NEXT_PUBLIC_CYPRESS_IS_TEST_ENV")

class EmployeeIDCard(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    firstName: str
    lastName: str
    address: str
    phoneNumber: str
    photoOfPerson: str
    dateJoined: datetime
    company: str
    isRegular: Optional[bool] = False
    companyRole: str
    employeeSignature: str
    isOJT: Optional[bool] = False
    version: int = Field(..., alias='_version')

    def to_dict(self):
        return {
            "_id": self.id,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "address": self.address,
            "phoneNumber": self.phoneNumber,
            "photoOfPerson": self.photoOfPerson,
            "dateJoined": self.dateJoined,
            "company": self.company,
            "isRegular": self.isRegular,
            "companyRole": self.companyRole,
            "employeeSignature": self.employeeSignature,
            "isOJT": self.isOJT,
            "_version": self.version,
        }

    def generate_id_card(self):
        ref_id = self.id
        # firstName = self.firstName
        # lastName = self.lastName
        name = self.firstName + ' ' + self.lastName
        address = self.address
        phoneNumber = self.phoneNumber
        photo_path = self.photoOfPerson
        dateJoined = self.dateJoined
        company = self.company
        # isRegular = self.isRegular
        # isOJT = self.isOJT
        type_of_employee = self.companyRole
        employeeSignature = self.employeeSignature

        card_width, card_height = 591, 1004

        print(photo_path, 'photo_path')

        background_path = "server/IDassets/"
        companyName = ""
        if company == "PPC":
            companyName = "Pustanan Printers Cebu"
            background_path += "ppcIDFront.png"
            background_path_back = "server/IDassets/ppcIDBack.png"
        if company == "BB":
            companyName = "Best Bags"
            background_path += "bbIDfront.png"
            background_path_back = "server/IDassets/bbIDBack.png"
        if company == "PPB":
            companyName = "Paper Boy"
            background_path += "ppbIDfront.png"
            background_path_back = "server/IDassets/ppbIDBack.png"
        if company == "SP":
            companyName = "Star Pack"
            background_path += "spIDfront.png"
            background_path_back = "server/IDassets/spIDBack.png"

        if company not in ["PPC", "BB", "PPB", "SP"]:
            companyName = company
            background_path += "ppcIDfront.png"
            background_path_back = "server/IDassets/ppcIDBack.png"

        try:
            background = Image.open(background_path).resize(
                (card_width, card_height))
        except Exception as e:
            print(f"Error loading background image: {e}")
            return None

        draw = ImageDraw.Draw(background)

        font_path = "arial.ttf"
        name_font = ImageFont.truetype(font_path, size=50)
        role_font = ImageFont.truetype(font_path, size=40)
        ref_id_font = ImageFont.truetype(font_path, size=30)

        if photo_path:
            try:
                if photo_path.startswith("http"):
                    response = requests.get(photo_path)
                    response.raise_for_status()
                    photo = Image.open(BytesIO(response.content)).resize(
                        (270, 269))
                else:
                    photo = Image.open(photo_path).resize((270, 269))

                photo = photo.convert("RGBA")
                circle_mask = Image.new("L", (photo.width, photo.height), 0)
                draw_circle = ImageDraw.Draw(circle_mask)
                draw_circle.ellipse((0, 0, photo.width, photo.height),
                                    fill=255)
                photo = Image.composite(photo,
                                        Image.new("RGB", photo.size, "white"),
                                        circle_mask)

                background.paste(photo, (160, 214), circle_mask)

                # background.paste(photo, (195, 260))
            except Exception as e:
                print(f"Error loading photo: {e}")


        name_font = ImageFont.truetype(font_path, size=35)
        name_width = draw.textbbox((0, 0), name.upper(), font=name_font)[2]

        image_width = background.width
        x_name_position = (image_width - name_width) // 2

        draw.text((x_name_position, 610), name.upper(), fill="black", font=name_font)

        name_tag_font = ImageFont.truetype(font_path, size=25)
        name_tag_width = draw.textbbox((0, 0), f"NAME", font=name_tag_font)[2]
        x_name_tag_position = (image_width - name_tag_width) // 2
        draw.text((x_name_tag_position, 670), f"NAME", fill="black", font=name_tag_font)

        role_font = ImageFont.truetype(font_path, size=30)

        role_width = draw.textbbox((0, 0), type_of_employee.upper(), font=role_font)[2]
        x_role_position = (image_width - role_width) // 2

        draw.text((x_role_position, 720), type_of_employee.upper(), fill="black", font=role_font)

        role_tag_font = ImageFont.truetype(font_path, size=25)
        role_tag_width = draw.textbbox((0, 0), f"ROLE", font=role_tag_font)[2]
        x_role_tag_position = (image_width - role_tag_width) // 2

        draw.text((x_role_tag_position, 770), f"ROLE", fill="black", font=role_tag_font)

        print(employeeSignature, 'employeeSignature')

        if employeeSignature:
            try:
                if employeeSignature.startswith("http"):
                    response = requests.get(employeeSignature)
                    response.raise_for_status()
                    signature = Image.open(BytesIO(response.content))

                    if signature.mode in ('RGBA', 'LA'):
                        background_layer = Image.new('RGB', signature.size, (255, 255, 255))
                        background_layer.paste(signature, mask=signature.split()[3])
                        signature = background_layer

                    signature = signature.resize((200, 100))
                else:
                    signature = Image.open(employeeSignature).resize((200, 100))

                background.paste(signature, (60, 800))
            except Exception as e:
                print(f"Error loading signature: {e}")

        draw.text((80, 880), f"Signature", fill="black", font=ImageFont.truetype(font_path, size=25))

        draw.text((410, 880), f"H.R.", fill="black", font=ImageFont.truetype(font_path, size=25))

        text = f"Property of {companyName}. ©"
        font = ImageFont.truetype(font_path, size=25)

        text_width = draw.textbbox((0, 0), text, font=font)[2]

        image_width = background.width
        x_position = (image_width - text_width) // 2

        draw.text((x_position, 955), text, fill="white", font=font)

        directory = 'Server/EmployeeIDs/'
        if not os.path.exists(directory):
            os.makedirs(directory)

        output_path = os.path.join(
            directory, f"{self.firstName+self.lastName}_id_card.png")

        background.save(output_path)
        print(f"ID card saved to {output_path}")

        try:
            back = Image.open(background_path_back).resize((card_width, card_height))
        except Exception as e:
            print(f"Error loading background image: {e}")
            return

        draw_back = ImageDraw.Draw(back)
        terms_font = ImageFont.truetype(font_path, size=25)

        draw_back.text((230, 120), f"TERMS", fill="black", font=ImageFont.truetype(font_path, size=30))

        terms = "This card is the property of the company and must be returned upon request. " \

        terms_lines = textwrap.wrap(terms, width=40)
        y_text = 170
        for line in terms_lines:
            draw_back.text((65, y_text), line, fill="black", font=terms_font)
            y_text += terms_font.size + 5

        draw_back.text((65, 300), f"Address:", fill="black", font=ImageFont.truetype(font_path, size=35))

        address_font = ImageFont.truetype(font_path, size=30)
        x_text = 100

        address_lines = textwrap.wrap(address, width=35)
        y_text = 350
        for line in address_lines:
            draw_back.text((x_text, y_text), line, fill="black", font=address_font)
            y_text += address_font.size + 5

        draw_back.text((65, 480), f"Phone:", fill="black", font=ImageFont.truetype(font_path, size=35))

        phone_font = ImageFont.truetype(font_path, size=30)
        draw_back.text((100, 530), phoneNumber, fill="black", font=phone_font)

        draw_back.text((65, 620), f"Date Joined:", fill="black", font=ImageFont.truetype(font_path, size=35))

        date_font = ImageFont.truetype(font_path, size=30)
        draw_back.text((100, 680), dateJoined.strftime("%B %d, %Y"), fill="black", font=date_font)

        barcode = Code128(ref_id, writer=ImageWriter())
        options = {
            'module_width': 0.5,
            'module_height': 5.0,
            'quiet_zone': 1.0,
            'font_size': 0,
            'text_distance': 0.0,
            'background': 'white',
            'foreground': 'black',
            'write_text': False
        }
        barcode.save("Server/IDBarcodes/"+f"{name}")
        barcode_img = Image.open(f"Server/IDBarcodes/{name}.png").resize((500, 130))
        back.paste(barcode_img, (45, 800))

        # back_output_path = os.path.join(output_path, f"{name.replace(' ', '_')}_id_card_back.png")
        back_output_path = os.path.join(directory, f"{self.firstName+self.lastName.replace(' ', '_')}_id_card_back.png")
        back.save(back_output_path)
        print(f"Back side of ID card saved to {back_output_path}")

        upload_url = self.uploadListToFirebaseStorage([output_path, back_output_path], "EmployeeIDs")
        return upload_url

    def uploadListToFirebaseStorage(self, list_of_photos, folder_name):
        if not _apps:
            cred = credentials.Certificate(
                "Server/pustananemployeeprofile-firebase-adminsdk-47jwz-bc5daaacc7.json"
            )
            initialize_app(cred, {
                "storageBucket":
                "pustananemployeeprofile.firebasestorage.app"
            })

        bucket = storage.bucket()
        download_urls = []
        for photo in list_of_photos:
            blob = bucket.blob(f"{folder_name}/{photo}")
            blob.upload_from_filename(photo)
            blob.make_public()

            download_url = f"{blob.public_url}?updated={int(time.time())}"
            download_urls.append(download_url)
            print(f"{photo} uploaded to Firebase Storage" + download_url)

        to_return = {
            "_id": self.id,
            "name": self.firstName + " " + self.lastName,
            "companyRole": self.companyRole,
            "IDCardURL": {"front":download_urls[0], "back":download_urls[1]},
            '_version': self.version
        }

        print(to_return)

        return to_return
    
    def draw_centered_text(self, draw, image_width, y_position, text, font, fill="white"):
        draw = ImageDraw.Draw(draw)
        text_width = draw.textbbox((0, 0), text, font=font)[2]
        x_position = (image_width - text_width)
        # draw.text((x_position, y_position), text, fill=fill, font=font)
        return {'x': x_position, 'y': y_position}

employee = {
    "_id": 'BPi81fLbqzianOUXm2KDZTvrxhioRr5r',
    "firstName": "Michael Tristan",
    "lastName": "Letigio",
    "address": "123 Main Street, Cebu City, Philippines",
    "phoneNumber": "+63 912 345 6789",
    "photoOfPerson": "server/test_assets/minor.png",
    "resumePhotosList": ["resume_page1.jpg", "resume_page2.jpg"],
    "biodataPhotosList": ["biodata_page1.jpg"],
    "email": "michael.flores@example.com",
    "dateJoined": datetime(2024, 1, 15).date(),
    "company": "PPC",
    "isRegular": False,
    "companyRole": "IT HEAD",
    "isOJT": True,
    "employeeSignature": "https://firebasestorage.googleapis.com/v0/b/pustananemployeeprofile.firebasestorage.app/o/employees%2FValLetigio%2FemployeeSignature-53957-0?alt=media&token=0c9315d3-872b-4656-b563-915777ab4b05",
    "dailyWage": 800.50,
    "_version": 1,
}

# EmployeeIDCard(**employee).generate_id_card()
