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
    <meta name="description" content="Research" />
    <meta name="author" content="Teon L Brooks" />
    <!--[if IE]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <![endif]-->
    <title>Teon Brooks' Research</title>
    <!-- BOOTSTRAP CORE STYLE CSS -->
    <link href="assets/css/bootstrap.css" rel="stylesheet" />
    <link href="assets/css/cover.css" rel="stylesheet" />
    <!-- FONTAWESOME STYLE CSS -->
    <link href="assets/css/font-awesome.min.css" rel="stylesheet" />
    <!-- CUSTOM STYLE CSS -->
    <!-- GOOGLE FONT -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
</head>
<!--/.HEADER END-->
<!--/.BODY START-->
<body>
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
                <a class="navbar-brand" href="#">Research</a>
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
    <div class="site-wrapper">
        <div class="site-wrapper-inner">
            <div class="cover-container">
                <div class="inner-cover">
                    <h1 class="cover-heading">Research</h1>
                    <p class="lead">
                        <br>
                        <h2 class>This page is a work in progress...</h2>
                        <br><br>
                        I am a currently a PhD candidate in cognitive neuroscience at New York University working with 
                        <a href=http://psych.nyu.edu/morphlab/people/alec.html>Dr. Alec Marantz</a> as well as 
                        <a href="http://psych.nyu.edu/clash/poeppellab/david-poeppel/">Dr. David Poeppel</a>. 
                        <br><br>
                        Some of my past work looked at the computations involved in the lexical access of compound words. 
                        In English, compound words are a very productive word forming tool that involves composing two independent 
                        representations with one another. I am interested in how the brain processes words that have this unique 
                        characteristic and how they are represented in our mental dictionary. 
                        <br><br>                    
                        My current research is on focused on how the brain processes semantic meaning, and understanding 
                        what eye-movements related to language processing can tell us about underlying brain responses. This 
                        linking hypothesis is crucial to understanding how the brain orchestrates all the stages involved in 
                        reading and accessing meaning. Relatedly, I am interested in pattern classification of brain activity, 
                        that is, using decoding techniques, can we predict reading behaviors from neural activity.
                        <br>
                        I am an avid programmer and really into the open-source community. I am currently a core developer to two 
                        academic software packages: <a href="http://github.com/mne-tools/mne-python">MNE-Python</a> for MEG and EEG 
                        data processing and analysis and <a href="http://github.com/pyeparse/pyeparse">PyeParse</a> for Eye-tracking 
                        data processing and analysis.
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
        <div class="row pad-bottom">
            <div class="col-md-12" align=center>
                <h4> <strong>SOCIAL LINKS</strong> </h4>
                <p>
                    <a href="https://github.com/teonlamont"><i class="fa fa-github-square fa-3x"  ></i></a>
                    <a href="http://twitter.com/teonlamont"><i class="fa fa-twitter-square fa-3x"  ></i></a>
                    <a href="https://www.linkedin.com/in/teonlamont"><i class="fa fa-linkedin-square fa-3x"  ></i></a>
                    <br><br>
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

<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>

<!-- BOOTSTRAP SCRIPTS  -->
<script src="assets/plugins/bootstrap.js"></script>


</html>
<!--/.JS END-->
"""

# Structure: header, quote, carousel, highlights, map, comments, footer 
# media
html = [html_header, navbar, body, html_footer]
html = "\n\n".join(html)

with open(op.join(assets, '..', 'research.html'), 'w') as FILE:
    FILE.write(html)
