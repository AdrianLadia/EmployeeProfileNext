from PIL import Image, ImageDraw, ImageFont
import qrcode
import os
from datetime import datetime
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
    isOJT: Optional[bool] = False

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
            "isOJT": self.isOJT,
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
        isRegular = self.isRegular
        isOJT = self.isOJT
        type_of_employee = self.companyRole
        qr_data = ref_id

        card_width, card_height = 591, 1004

        print(photo_path, 'photo_path')

        background_path = "server/IDassets/"

        if company == "PPC":
            background_path += "ppcIDFront.png"
        if company == "BB":
            background_path += "bbIDfront.png"
        if company == "PPB":
            background_path += "ppbIDfront.png"
        if company == "SP":
            background_path += "spIDfront.png"

        if company not in ["PPC", "BB", "PPB", "SP"]:
            background_path += "ppcIDfront.png"

        try:
            background = Image.open(background_path).resize(
                (card_width, card_height))
        except Exception as e:
            print(f"Error loading background image: {e}")

        draw = ImageDraw.Draw(background)

        font_path = "arial.ttf"
        name_font = ImageFont.truetype(font_path, size=50)
        role_font = ImageFont.truetype(font_path, size=40)
        ref_id_font = ImageFont.truetype(font_path, size=30)

        # border_color = (0, 0, 0)
        # border_width = 10
        # draw.rectangle(
        #     [(border_width, border_width),
        #      (card_width - border_width, card_height - border_width)],
        #     outline=border_color,
        #     width=border_width,
        # )

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

        draw.text((50, 630), f"Name:", fill="black", font=ImageFont.truetype(font_path, size=30))

        name_font = ImageFont.truetype(font_path, size=35)
        # name = textwrap.fill(name, width=30)
        x_text = 140

        name_lines = textwrap.wrap(name, width=35)
        y_text = 630

        for line in name_lines:
            draw.text((x_text, y_text), f" {line}", fill="black", font=name_font)
            y_text += name_font.size + 5


        draw.text((50, 720), f"Role:", fill="black", font=ImageFont.truetype(font_path, size=30))

        role_font = ImageFont.truetype(font_path, size=30)
        x_text = 140

        type_of_employee_lines = textwrap.wrap(type_of_employee, width=35)
        y_text = 720
        for line in type_of_employee_lines:
            draw.text((x_text, y_text), line, fill="black", font=role_font)
        # draw.text((255, 620), f"{type_of_employee}", fill="black", font=role_font)

        # ref_id_font = ImageFont.truetype(font_path, size=25)
        # draw.text((40, 850),
        #           f"ID no.: {ref_id}",
        #           fill="black",
        #           font=ref_id_font)

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
        # qr_code_img = qr.make_image(fill="black", back_color="white").resize(
        #     (170, 170))
        # background.paste(qr_code_img, (215, 680))

        draw.text((130, 955), f"Property of Pustanan Printers. ©", fill="white", font=ImageFont.truetype(font_path, size=25))

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
        barcode_img = Image.open(f"Server/IDBarcodes/{name}.png").resize((400, 130))
        background.paste(barcode_img, (95, 800))

        directory = 'Server/EmployeeIDs/'
        if not os.path.exists(directory):
            os.makedirs(directory)

        output_path = os.path.join(
            directory, f"{self.firstName+self.lastName}_id_card.png")

        background.save(output_path)
        print(f"ID card saved to {output_path}")

        # return {
        #     "_id": self.id,
        #     "name": self.firstName + " " + self.lastName,
        #     "companyRole": self.companyRole,
        #     "IDCardURL": output_path,
        # }

        if not _apps:
            cred = credentials.Certificate(
                "Server/pustananemployeeprofile-firebase-adminsdk-47jwz-bc5daaacc7.json"
            )
            initialize_app(cred, {
                "storageBucket":
                "pustananemployeeprofile.firebasestorage.app"
            })

        bucket = storage.bucket()
        blob = bucket.blob(
            f"EmployeeIDs/{self.firstName+self.lastName}_id_card.png")
        blob.upload_from_filename(output_path)
        blob.make_public()

        download_url = blob.public_url
        print(f"ID card uploaded to Firebase Storage" + download_url)

        to_return = {
            "_id": self.id,
            "name": self.firstName + " " + self.lastName,
            "companyRole": self.companyRole,
            "IDCardURL": download_url,
        }

        print(to_return)

        return to_return

        # back side of ID card

        # back = Image.new("RGB", (card_width, card_height), background_color)

        # try:
        #     back = Image.open(background_path).resize((card_width, card_height))
        # except Exception as e:
        #     print(f"Error loading background image: {e}")
        #     return

        # draw_back = ImageDraw.Draw(back)
        # terms_font = ImageFont.truetype(font_path, size=18)

        # terms = "This card is the property of the company and must be returned upon request. " \

        # terms_lines = textwrap.wrap(terms, width=60)
        # y_text = 50
        # for line in terms_lines:
        #     draw_back.text((50, y_text), line, fill="black", font=terms_font)
        #     y_text += terms_font.size + 5

        # draw_back.text((50, 300), f"Property of {company}", fill="black", font=ref_id_font)

        # # back_output_path = os.path.join(output_path, f"{name.replace(' ', '_')}_id_card_back.png")
        # back_output_path = os.path.join(directory, f"{employee['name'].replace(' ', '_')}_id_card_back.png")
        # back.save(back_output_path)
        # print(f"Back side of ID card saved to {back_output_path}")


employee = {
    "_id": 'BPi81fLbqzianOUXm2KDZTvrxhioRr5r',
    "firstName": "Val",
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
    "dailyWage": 800.50,
    "_version": 1,
}

# EmployeeIDCard(**employee).generate_id_card()
