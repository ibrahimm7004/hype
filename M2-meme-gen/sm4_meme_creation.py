from PIL import Image, ImageDraw, ImageFont
import os
import difflib

TEMPLATE_FOLDER = r"C:\Users\hp\Desktop\fyp\mvp\M2-meme-gen\meme-templates-updated-2"
OUTPUT_FOLDER = "generated-memes"


def find_template_file(template_folder, normalized_name):
    print(f"\n🔍 Looking for: {normalized_name}")

    files = os.listdir(template_folder)
    base_names = [os.path.splitext(f)[0].lower() for f in files]

    # First: exact match on base name
    for f in files:
        base, ext = os.path.splitext(f)
        if base.lower() == normalized_name.lower() and ext.lower() in [".jpg", ".jpeg", ".png"]:
            print(f"✅ Exact match found: {f}")
            return os.path.join(template_folder, f)

    # Second: fuzzy fallback
    print("🔁 Trying fuzzy matching...")
    best_match = difflib.get_close_matches(
        normalized_name.lower(), base_names, n=1, cutoff=0.8)
    if best_match:
        for f in files:
            if os.path.splitext(f)[0].lower() == best_match[0]:
                print(f"✅ Fuzzy match found: {f}")
                return os.path.join(template_folder, f)

    print(f"❌ No match found for: {normalized_name}")
    return None


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
        template_path = find_template_file(TEMPLATE_FOLDER, meme_name)
        if not template_path:
            print(f"❌ Template not found: {meme_name}")
            return

        img = Image.open(template_path)
        img_width, img_height = img.size

        top_text, bottom_text = split_text(top_text), split_text(bottom_text)
        font_size = 15 if len(top_text.split()) > 15 or len(
            bottom_text.split()) > 15 else 20

        # ✅ Load font safely
        try:
            font = ImageFont.truetype("impact.ttf", font_size)
        except IOError:
            font = ImageFont.truetype("arial.ttf", font_size)

        draw = ImageDraw.Draw(img)

        def draw_text(text, y_position, max_height, align_bottom=False):
            lines = text.split("\n")

            # Start with initial font size
            current_font_size = font_size
            adjusted_font = font

            # Try reducing font size if any line is too wide
            while True:
                too_wide = False
                for line in lines:
                    bbox = draw.textbbox((0, 0), line, font=adjusted_font)
                    text_width = bbox[2] - bbox[0]
                    if text_width > img_width - 20:  # 20px margin
                        too_wide = True
                        break
                if too_wide and current_font_size > 10:
                    current_font_size -= 1
                    try:
                        adjusted_font = ImageFont.truetype(
                            "impact.ttf", current_font_size)
                    except IOError:
                        adjusted_font = ImageFont.truetype(
                            "arial.ttf", current_font_size)
                else:
                    break

            line_spacing = current_font_size + 5
            total_text_height = len(lines) * line_spacing

            if align_bottom:
                y_position = img_height - total_text_height - 20
                if y_position < img_height - max_height:
                    y_position = img_height - max_height

            for i, line in enumerate(lines):
                bbox = draw.textbbox((0, 0), line, font=adjusted_font)
                text_width = bbox[2] - bbox[0]
                x_position = (img_width - text_width) // 2
                y_offset = y_position + (i * line_spacing)
                draw.text((x_position, y_offset), line, font=adjusted_font,
                          fill="white", stroke_fill="black", stroke_width=3)

        draw_text(top_text.upper(), 10, img_height // 3)
        draw_text(bottom_text.upper(), img_height - (font_size * 3),
                  img_height // 3, align_bottom=True)

        os.makedirs(OUTPUT_FOLDER, exist_ok=True)
        output_path = os.path.join(OUTPUT_FOLDER, meme_name + "_meme.jpg")
        img.save(output_path, "JPEG")
        print(f"✅ Meme saved: {output_path}")

    except Exception as e:
        print(f"🔥 Unexpected error for template '{meme_name}': {e}")
