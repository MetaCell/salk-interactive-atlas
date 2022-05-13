import numpy as np
import io
from PIL import Image
from matplotlib.figure import Figure


def get_image_from_array(img_array: np.array, mode: str = 'RGBA') -> Image:
    i = Image.fromarray(img_array)
    return i.convert(mode)


def apply_greyscale_alpha_mask(img: Image) -> Image:
    mask = img.convert('L')
    img.putalpha(mask)
    return img


def black_to_transparent(img: Image) -> Image:
    rgb = np.array(img)
    h, w = rgb.shape[:2]

    # Add an alpha channel, half opaque (128)
    rgba = np.dstack((rgb, np.zeros((h, w), dtype=np.uint8) + 128))

    # Make mask of black pixels - mask is True where image is black
    m_black = (rgba[:, :, 0:3] == [0, 0, 0]).all(2)

    # Make all pixels matched by mask into transparent ones
    rgba[m_black] = (0, 0, 0, 0)

    # Convert Numpy array back to PIL Image and s
    return Image.fromarray(rgba)


def stack_images(background: Image, foreground: Image) -> Image:
    return Image.alpha_composite(background, foreground)


def fig_to_img(fig: Figure) -> Image:
    buf = io.BytesIO()
    fig.savefig(buf, transparent=True)
    buf.seek(0)
    img = Image.open(buf)
    return img
