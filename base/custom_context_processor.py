from .models import Base_ColorPalette


def custom_template_vars(request):
    color_objects = Base_ColorPalette.objects.all()

    if "color" in request.COOKIES:
        wanted_color = request.COOKIES["color"]
    else:
        if len(color_objects) > 0:
            wanted_color = color_objects[0]
        else:
            raise Exception(
                "No color objects found! Did you load the colors.json fixture using the loaddata command?"
                + "\n$ python3 manage.py loaddata colors.json"
            )

    try:
        start_colors = color_objects.get(name=wanted_color)
    except:
        start_colors = color_objects[0]

    return {
        "color_options": color_objects,
        "start_colors": start_colors,
    }
