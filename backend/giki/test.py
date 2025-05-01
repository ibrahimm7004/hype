from PIL import Image, ImageDraw, ImageFont
import textwrap


def draw_wrapped_text(draw, text, font, fill, max_width, x, y, align="left", highlight_words=None):
    wrapped_lines = textwrap.wrap(text, width=22)
    for line in wrapped_lines:
        current_x = x

        # Get width using textbbox
        bbox = draw.textbbox((0, 0), line, font=font)
        line_width = bbox[2] - bbox[0]

        if align == "center":
            current_x = x - line_width // 2
        elif align == "right":
            current_x = x - line_width

        # Draw with highlight if any
        if highlight_words:
            words = line.split(" ")
            for word in words:
                display_word = word + " "
                color = "yellow" if any(hw.lower() in word.lower() for hw in highlight_words) else fill

                word_bbox = draw.textbbox((0, 0), display_word, font=font)
                word_width = word_bbox[2] - word_bbox[0]

                draw.text((current_x, y), display_word, font=font, fill=color)
                current_x += word_width
        else:
            draw.text((current_x, y), line, font=font, fill=fill)

        y += font.size + 15

    return y


def create_social_post_on_bg(
    bg_image_path,
    heading="BREAKING",
    title="GIKI Launches AI Innovation Lab",
    highlight=["AI", "Innovation", "Lab"],
    subtitle="Empowering future tech leaders in Pakistan 🇵🇰",
    output_path="social_post.jpg",
    font_path="Montserrat-Bold.ttf",
    style="style1"  # 'style1', 'style2', 'style3'
):
    # Load and resize background
    img = Image.open(bg_image_path).convert("RGB")
    img = img.resize((1080, 1080))
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 120))
    img = Image.alpha_composite(img.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(img)
    
    # Add white inset border
    border_margin = 25
    border_width = 2
    draw.rectangle(
        [border_margin, border_margin, img.width - border_margin, img.height - border_margin],
        outline="white",
        width=border_width
)


    # Load fonts
    heading_font = ImageFont.truetype(font_path, 60)
    title_font = ImageFont.truetype(font_path, 72)
    subtitle_font = ImageFont.truetype(font_path, 48)

    if style == "style1":
        # Left-aligned block
        y = 80
        x = 60
        draw.text((x, y), heading.upper(), font=heading_font, fill="white")
        y += 100
        y = draw_wrapped_text(draw, title, title_font, "white", 900, x, y, align="left", highlight_words=highlight)
        y += 30
        draw_wrapped_text(draw, subtitle, subtitle_font, "lightgray", 900, x, y, align="left")

    elif style == "style2":
        # Center-aligned block
        y = 80
        center_x = 540
        draw.text((center_x, y), heading.upper(), font=heading_font, fill="white", anchor="mm")
        y += 100
        y = draw_wrapped_text(draw, title, title_font, "white", 900, center_x, y, align="center", highlight_words=highlight)
        y += 30
        draw_wrapped_text(draw, subtitle, subtitle_font, "lightgray", 900, center_x, y, align="center")

    elif style == "style3":
        # Story-style: heading top-left, title in center box, subtitle bottom
        # Heading
        draw.text((60, 60), heading.upper(), font=heading_font, fill="white")

        # Title in the middle box
        center_y = 1080 // 2 - 100
        draw_wrapped_text(draw, title, title_font, "white", 900, 540, center_y, align="center", highlight_words=highlight)

        # Subtitle at bottom
        bottom_y = 880
        draw_wrapped_text(draw, subtitle, subtitle_font, "lightgray", 900, 540, bottom_y, align="center")

    # Save
    final = img.convert("RGB")
    final.save(output_path)
    print(f"Post saved to {output_path}")


# Example usage:
create_social_post_on_bg(
    bg_image_path="/Users/talhaimtiaz/Downloads/Aerial-3.png",
    title="GIKI Launches AI Innovation Lab",
    highlight=["AI", "Innovation", "Lab"],
    subtitle="Revolutionizing education through artificial intelligence.",
    font_path="/Users/talhaimtiaz/Downloads/Montserrat-Bold.ttf",
    output_path="giki_ai_post_style2.jpg",
    style="style2"  # try style1, style2, or style3
)
