from PIL import Image
import PIL.ImageOps

IMAGE_PATH = '../applications/portal/frontend/src/assets/details/io_mapping.png'

image = Image.open(IMAGE_PATH)
image = image.convert('RGB')

inverted_image = PIL.ImageOps.invert(image)
inverted_image.save('test.png')
rgba = inverted_image.convert("RGBA")
datas = rgba.getdata()

BACKGROUND_COLOR = (0, 0, 0)

newData = []
for item in datas:
    if item[0] == BACKGROUND_COLOR[0] and item[1] == BACKGROUND_COLOR[1] and item[2] == BACKGROUND_COLOR[2]:
        # storing a transparent value when we find a black colour
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)  # other colours remain unchanged

rgba.putdata(newData)
rgba.save("io_mapping.png", "PNG")
