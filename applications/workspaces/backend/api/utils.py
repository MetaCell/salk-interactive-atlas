import os

from django.http import FileResponse


def send_file(file):
    """                                                                         
    Send a file through Django without loading the whole file into              
    memory at once. The FileWrapper will turn the file object into an           
    iterator for chunks of 8KB.                                                 
    """
    response = FileResponse(open(file.name, "rb"), content_type='text/plain')
    response['Content-Length'] = file.size
    response['Content-Disposition'] = 'attachment; filename="%s"' % os.path.basename(file.name)
    return response
