import os.path as op
from glob import glob


dirname = op.dirname(__file__)
assets = op.abspath(op.join(dirname, '..'))

########
# Header
########
html_header = u"""
<!--/.HEADER START-->
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content="travel" />
    <meta name="author" content="Teon L Brooks" />
    <!--[if IE]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <![endif]-->
    <title>Scrapbook</title>
    <!-- BOOTSTRAP CORE STYLE CSS -->
    <link href="assets/css/bootstrap.css" rel="stylesheet" />
    <!-- FONTAWESOME STYLE CSS -->
    <link href="assets/css/font-awesome.min.css" rel="stylesheet" />
    <!-- CUSTOM STYLE CSS -->
    <link href="assets/css/style.css" rel="stylesheet" />    
    <!-- GOOGLE FONT -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
    <!-- Photo Rotation STYLE CSS -->
    <link href="assets/css/rotate.css" rel="stylesheet" />

<!--/.HEADER END-->
"""

navbar = """
<!--/.NAVBAR START-->
<div class="navbar navbar-inverse navbar-fixed-top" >
    <div class="container">
        <ul class="nav navbar-nav navbar-brand">
            <li class="dropdown"><a href="#">Ticket Stubs</a>
                <ul class="dropdown-menu">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <li><a href="#carousel">Scrapbook</a></li>
                    <li><a href="#photos">Photos</a></li>
    			    <li><a href="#travel-map">Map</a></li>
                </ul>
			</li>
        </ul>
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav navbar-right">
                <li><a href="index.html">Home</a></li>
                 <li><a href="research.html">Research</a></li>
                <li><a href="travel.html">Travel</a></li>
            </ul>
        </div>
       
    </div>
</div>
<!--/.NAVBAR END-->
"""

########
# Notes
########
note_header = """
<!--/.NOTE START-->
<section class="note-sec" >        
    <div class="container">
        <div class="row text-center pad-row" >
            <div class="col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 ">
                <i class="fa fa-quote-left fa-3x"></i>
                                                <br>
                Take a piece of experience with you from wherever you go. - me
                <p style="color:black ">
                                                <br>
                           My first time ever on a plane was in 2007. After my
                    first visit to Europe, I was bitten by the travel bug. Traveling to me,
                        has become more of a state of mind, a lifestyle. It's been a way
                for me to connect with people from all over the world. We are part of a global
                    village.
                                                <br>
                        I compiled this moleskin of mine while traveling last year to Tel Aviv.
                    It has tickets dating back to 2001, and it's a collection of all ticket stubs: 
                    travel, concerts, movies, pretty much anything with decent ink, and good paper.

                </p>
            </div>
        </div>
    </div>             
</section>
<!--/.NOTE END-->
"""


########
# Notes
########
note_body = """
<!--/.NOTE END-->
<section class="note-sec" >        
    <div class="container">
        <div class="row text-center pad-row" >
            <div class="col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 ">
                <i class="fa fa-quote-left fa-3x"></i>
                    <p style="color:black">
                           
                    I'm deeply fascinated with memory, both as a scientist and as a traveler. 
                I collect ticket stubs because in a way, they serve as a memory currency; these 
            are the earnings of my life experiences. Ever since I was little, I liked to collect things: 
                coins, rocks, newspaper clipping, etc. We know that the best memories are shared one
            so I thought it might be useful to do something with these trinkets and share it with everyone. 
            This serves as a way for me to reflect on all the things I've done, connect with those I've met 
            along the way, and plan for new adventures. The journey has just begun ;)
                    </p>
            </div>
        </div>
    </div>             
</section>
<!--/.NOTE END-->
"""


###########
# Carousel
###########
carousel = list()
header = """
<!--/.CAROUSEL START-->
<section id="carousel" class="text-center">   
    <div id="carousel-scrapbook" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            <div class="item active">
                <img src="assets/images/pages/intro.jpg" align="center" alt="" />
                    <div class="carousel-caption" >
                        <h4 class="back-light">Welcome.</h4>
                    </div>
            </div>
"""
carousel.append(header)
pages = glob(op.join(assets, 'images/pages/scrapbook_Page_*.jpg'))

for page in pages:
    html = u'\t\t\t<div class="item">'
    page = op.basename(page)
    html += u'<img src="assets/images/pages/%s" alt="" /></div>' % page
    carousel.append(html)
carousel.append('\t\t</div>')



carousel.append(u'\t\t<ol class="carousel-indicators">')

indicator = u'\t\t\t<li data-target="#carousel-scrapbook" data-slide-to="0" '
indicator += u'class="active"></li>'
carousel.append(indicator)
for ii in range(1, len(pages) + 1):
    html = u'\t\t\t<li data-target="#carousel-scrapbook" '
    html += u'data-slide-to="%d"></li>' %ii
    carousel.append(html)
carousel[-1] += u'\n\t\t</ol>'
footer = """
<!-- Controls -->
<a class="left carousel-control" href="#carousel-scrapbook" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
</a>
<a class="right carousel-control" href="#carousel-scrapbook" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
</a>
</div>
</section>
<!--/.CAROUSEL END-->
"""
carousel.append(footer)
carousel = '\n'.join(carousel)

#########
# Photos
#########
photos = list()
header = """
<!--/.PHOTOS START-->
<section id="photos" class="text-center">
    <style>
        ul {         
            padding:0 0 0 0;
            margin:0 0 0 0;
        }
        ul li {     
            list-style:none;
            margin-bottom:25px;           
        }
        ul li img {
            cursor: pointer;
        }
        .modal-body {
            padding:5px !important;
        }
        .modal-content {
            border-radius:0;
        }
        .modal-dialog img {
            text-align:center;
            margin:0 auto;
        }
        .controls{          
            width:50px;
            display:block;
            font-size:11px;
            padding-top:8px;
            font-weight:bold;          
        }
        .next {
            float:right;
            text-align:right;
        }
    </style>
    <body>
        <div class="container">    
            <div class="row" style="text-align:center; border-bottom:1px dashed #ccc;  padding:0 0 20px 0; margin-bottom:40px;">
                <h3 style="font-family:arial; font-weight:bold; font-size:30px;">
                    Travel Highlights
                </h3>
            </div>
            <ul class="row">
    """
photos.append(header)

n_photos = len(glob(op.join(assets, 'images/highlights/travel_highlight - *_tn.jpg')))
for ii in range(1, n_photos + 1):
    html = u'\t\t\t\t<li class="col-lg-2 col-md-2 col-sm-3 col-xs-4">'
    html += u'<img class="img-responsive" '
    html += u'src="assets/images/highlights/travel_highlight - %d_tn.jpg"></li>' % ii
    photos.append(html)
photos.append(u'\t\t\t</ul>')
photos.append(u'\t\t</div> <!-- /container -->')

footer = """
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">         
                    <div class="modal-body">                
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    </body>
</section>
<!--/.PHOTOS END-->
"""
photos.append(footer)
photos = '\n'.join(photos)


#############
# Travel Map
#############
travelmap = """
<!--/.MAP START-->
<section id="travel-map">
    <div class="col-xs-24 text-center">
    <iframe src="https://www.google.com/maps/d/u/0/embed?mid=zZsTLjHcUH_k.ke8mpkwj2aCA" width="640" height="480"></iframe>
<!--/.MAP END-->
"""


#########
# Footer
#########
html_footer = """
<!--/.FOOTER START-->
<section id="footer-sec" >
    <div class="container" style="text-align: center">
        <div class="row  pad-bottom">
            <div class="col-md-12" align=center>
                <h4> <strong>SOCIAL LINKS</strong> </h4>
                <p>
                    <a href="https://github.com/teonlamont"><i class="fa fa-github-square fa-3x"  ></i></a>
                    <a href="http://twitter.com/teonlamont"><i class="fa fa-twitter-square fa-3x"  ></i></a>
                    <a href="https://www.linkedin.com/in/teonlamont"><i class="fa fa-linkedin-square fa-3x"  ></i></a>
                    <div>
                    <a href="https://www.facebook.com/teon.brooks"><i class="fa fa-facebook-square fa-3x"  ></i></a>
                    <a href="https://instagram.com/teonlamont"><i class="fa fa-instagram fa-3x"  ></i></a>
                    </div>
                </p>
            </div>
        </div>
    </div>
</section>         
<!--/.FOOTER END-->


<!--/.JS START-->
<!-- JAVASCRIPT FILES PLACED AT THE BOTTOM TO REDUCE THE LOADING TIME  -->
<!-- CORE JQUERY/Click action, order matters!  -->
<script src="assets/plugins/jquery-1.10.2.min.js"></script>
<script src="assets/js/photo-gallery.js"></script>  
<!-- BOOTSTRAP SCRIPTS  -->
<script src="assets/plugins/bootstrap.js"></script>
<!-- Carousel Script  -->
<script src="assets/js/carousel.js"></script>  
<!-- Google Analytics Script  -->
<script src="assets/js/google.js"></script>  

</body>
</html>
<!--/.JS END-->
"""

# Structure: header, quote, carousel, highlights, map, comments, footer 
html = [html_header, note_header, navbar, carousel, note_body, photos, travelmap, html_footer]
html = "\n\n".join(html)

with open(op.join(assets, '..', 'travel.html'), 'w') as FILE:
    FILE.write(html)
