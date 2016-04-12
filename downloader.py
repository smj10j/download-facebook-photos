from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import urllib
import base64

class MainPage(webapp.RequestHandler):
    def post(self):
        data = self._get_data()
        self.response.headers['Content-Type'] = data['type']
        self.response.headers['Content-disposition'] = "attachment; filename=" + data['filename']
        self.response.out.write(data['body'])

    def get(self):
        self.response.out.write('<h1>Download <a href="http://en.wikipedia.org/wiki/Data_URI_scheme">Data URI</a> with filename</h1>')
        self.response.out.write('Usage: <xmp><script type="text/javascript" src="http://download-data-uri.appspot.com/js/download-data-uri.js"></script>\n<script type="text/javascript">\ndownloadDataURI({\n\tfilename: "check.png", \n\tdata: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC"\n});\n</script></xmp>')

    def _get_data(self):
        encoding = 'url'
        result = {}
        data = self.request.POST['data']
        result['filename'] = self.request.POST['filename']
        tmp = data.split(',')
        parts = tmp[0].split(';')
        if parts is not None:
            for part in parts:
                part = part.lower()
                if part.startswith('data:'):
                    result['type'] = part[5:]
                elif part.startswith('charset='):
                    result['charset'] = part[8:]
                elif part == 'base64':
                    encoding = part
        if encoding == 'base64':
            result['body'] = base64.b64decode(tmp[1])
        else:
            result['body'] = urllib.unquote(tmp[1])
        if not result['filename']:
            result['filename'] = 'download.%s' % result['type'].split('/')[1]
        return result

application = webapp.WSGIApplication([('/', MainPage)])

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
