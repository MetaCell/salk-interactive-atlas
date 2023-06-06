import io
import math

import numpy
import numpy as np
from matplotlib.figure import Figure
from PIL import Image

from api.constants import HALF_OPAQUE


def get_image_from_image_array(img_array: np.array, mode: str = "RGBA") -> Image:
    i = Image.fromarray(img_array)
    return i.convert(mode)


def apply_greyscale_alpha_mask(img: Image) -> Image:
    mask = img.convert("L")
    img.putalpha(mask)
    return img


def black_to_transparent(img: Image, opacity: int = HALF_OPAQUE) -> Image:
    rgb = np.array(img)
    h, w = rgb.shape[:2]

    # Add an alpha channel, half opaque (128)
    rgba = np.dstack((rgb, np.zeros((h, w), dtype=np.uint8) + opacity))

    # Make mask of black pixels - mask is True where image is black
    m_black = (rgba[:, :, 0:3] == [0, 0, 0]).all(2)

    # Make all pixels matched by mask into transparent ones
    rgba[m_black] = (0, 0, 0, 0)

    # Convert Numpy array back to PIL Image
    return Image.fromarray(rgba)


def stack_images(background: Image, foreground: Image) -> Image:
    return Image.alpha_composite(background, foreground)


def fig_to_img(fig: Figure) -> Image:
    buf = io.BytesIO()
    fig.savefig(buf, transparent=True)
    buf.seek(0)
    img = Image.open(buf)
    return img


def fig_to_numpy(fig: Figure) -> np.array:
    img = fig_to_img(fig)
    grey_scale_array = numpy.array(img.convert('L'))
    # makes the array 2 color (black background, white centroids)
    two_color_array = numpy.where(grey_scale_array < 255, grey_scale_array, 0)
    return two_color_array


def pad_image(pil_img, top, right, bottom, left, color=(255, 0, 0, 0)) -> Image:
    width, height = pil_img.size
    new_width = math.ceil(width + right + left)
    new_height = math.ceil(height + top + bottom)
    result = Image.new(pil_img.mode, (new_width, new_height), color)
    result.paste(pil_img, (left, top))
    return result
