from anki import hooks
import re

regex = re.compile(r"「(.+?)」（(.+?)）")


def test_function(field_text: str, field_name: str, filter_name: str, ctx) -> str:
    if filter_name == 'jpf':
        return regex.sub(process_match, field_text)
    else:
        return field_text


def process_match(match):
    return f"<ruby>{match.group(1)}<rt>{match.group(2)}</rt></ruby>"


# register our function to be called when the hook fires
hooks.field_filter.append(test_function)