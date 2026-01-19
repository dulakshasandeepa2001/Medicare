#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os #meken os module eka import karanawa,os module kiynne operating system ekata sambandha functions walata access karanna puluwan module ekak.
import sys #meken sys module eka import karanawa,sys module kiynne python interpreter ekata sambandha functions walata access karanna puluwan module ekak.


def main(): #meken wennne main function eka hadanna puluwan
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_create.settings') #meken wennne DJANGO_SETTINGS_MODULE kiyala environment variable ekata 'user_create.settings' kiyala value ekak set karanna,mehemai karanne Django project eke settings module eka pennanna.
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
