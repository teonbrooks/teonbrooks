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
    <meta name="description" content="welcome" />
    <meta name="author" content="Teon L Brooks" />
    <!--[if IE]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <![endif]-->
    <title>Teon Brooks</title>
    <!-- BOOTSTRAP CORE STYLE CSS -->
    <link href="assets/css/bootstrap.css" rel="stylesheet" />

    <!-- FONTAWESOME STYLE CSS -->
    <link href="assets/css/font-awesome.min.css" rel="stylesheet" />
    <!-- CUSTOM STYLE CSS -->
    <link href="assets/css/style.css" rel="stylesheet" />
    <link href="assets/css/index-style.css" rel="stylesheet" />
    <!-- GOOGLE FONT -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
</head>
<!--/.HEADER END-->
<!--/.BODY START-->
<body>
<div class="cover-container">
"""

navbar = """
    <!--/.NAVBAR START-->
    
    <div class="navbar navbar-inverse navbar-fixed-top" >
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">About Me</a>
            </div>
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

#######
# Body
#######
body = """
    <div class="container">
        <div class="intro-header">
            <div class="container-textbox">
            </div>
        </div>
        <h1>Teon L Brooks</h1>
        <h2>PhD Candidate</h2>
        <h5><a href="http://nsfgrfp.org">NSF Graduate Research Fellow</a>
            <br><a href=http://stem.chateaubriand-fellowship.org>French Embassy Chateaubriand Fellow</a>
        </h5>
        <br>
        <center><a class="twitter-timeline" href="https://twitter.com/teonlamont" data-widget-id="607926748022513664">
        Tweets by @teonlamont</a>
        </center>
        <script src="assets/js/index.js"></script>
        <br>
    </div>
</body>
"""

body2 = """
    <div class="site-wrapper">
        <div class="site-wrapper-inner">
            <div class="cover-container">
                <div class="inner cover">
                    <h1 class="cover-heading">Teon L Brooks</h1>
                    <h3 class>National Science Foundation Graduate Research Fellow
                    <br>French Embassy STEM Chateaubriand Fellow</h3>
                    <br><br>
                    <h2 class>This page is a work in progress...</h2>
                    <h2 class>Check out my <a href="travel.html">Travel</a> page while you're here :)</h2>
                    <br><br>
                    <p class="lead">
                    In my spare time, I like to dance; I am currently on hiatus from amateur competitive ballroom dancing. 
                    I enjoy <a href="travel.html">traveling</a> and learning language. I am currently learning Portuguese 
                    and improving my French.

                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
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
<script src="assets/js/index.js"></script>

<!-- BOOTSTRAP SCRIPTS  -->
<script src="assets/plugins/bootstrap.js"></script>

</div>
</html>
<!--/.JS END-->
"""

# Structure: header, quote, carousel, highlights, map, comments, footer 
html = [html_header, navbar, body, html_footer]
html = "\n\n".join(html)

with open(op.join(assets, '..', 'index.html'), 'w') as FILE:
    FILE.write(html)
