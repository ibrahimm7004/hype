from PIL import Image, ImageDraw, ImageFont
import os

TEMPLATE_FOLDER = "Ai/M2_meme_gen/images-meme-template"
OUTPUT_FOLDER = "static/generated-memes"


def split_text(text, max_chars=30):
    words, lines, line = text.split(), [], ""
    for word in words:
        if len(line) + len(word) + (1 if line else 0) <= max_chars:
            line += (" " if line else "") + word
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return "\n".join(lines)


def generate_meme(meme_name, top_text, bottom_text):
    try:
        img = Image.open(os.path.join(TEMPLATE_FOLDER, meme_name + ".jpg"))
        img_width, img_height = img.size

        try:
            font_path = "Ai/M2_meme_gen/fonts/impact.ttf"
        except IOError:
            font_path = "Ai/M2_meme_gen/fonts/arial.ttf"

        top_text, bottom_text = split_text(top_text), split_text(bottom_text)
        font_size = 15 if len(top_text.split()) > 15 or len(
            bottom_text.split()) > 15 else 20
        font = ImageFont.truetype(font_path, font_size)
        draw = ImageDraw.Draw(img)

        def draw_text(text, y_position, max_height, align_bottom=False):
            lines = text.split("\n")
            line_spacing = font_size + 5
            total_text_height = len(lines) * line_spacing

            if align_bottom:
                y_position = img_height - total_text_height - 20
                if y_position < img_height - max_height:
                    y_position = img_height - max_height

            for i, line in enumerate(lines):
                bbox = draw.textbbox((0, 0), line, font=font)
                text_width, text_height = bbox[2] - bbox[0], bbox[3] - bbox[1]
                x_position = (img_width - text_width) // 2
                y_offset = y_position + (i * line_spacing)
                draw.text((x_position, y_offset), line, font=font,
                          fill="white", stroke_fill="black", stroke_width=3)

        draw_text(top_text.upper(), 10, img_height // 3)
        draw_text(bottom_text.upper(), img_height - (font_size * 3),
                  img_height // 3, align_bottom=True)

        output_path = os.path.join(OUTPUT_FOLDER, meme_name + "_meme.jpg")
        img.save(output_path, "JPEG")
        print(f"Meme saved: {output_path}")
        
        return output_path

    except FileNotFoundError:
        print(f"Template not found: {meme_name}")
