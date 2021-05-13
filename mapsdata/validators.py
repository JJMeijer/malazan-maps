import re

from django.core.exceptions import ValidationError


def validate_shortname(shortname):
    """Validate shortname which is used in the URL. Main goal of this is to ensure the
    URL looks sort of nice & to not allow spaces & other special characters"""
    if not re.search(r'^[a-z0-9\-_]+$', shortname):
        raise ValidationError('The short name can only contain lowercase letters, numbers, - and _')
