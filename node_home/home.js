module.exports= (
`
<head>
  <title>Michael Pierce - San Francisco</title>
  <meta name="viewport" content="width=device-width, user-scalable=no">
  <meta name="description" content="Michael Pierce - San Francisco">
  <style>
    h1,
    h2,
    h3 {
      margin: 0;
      padding: 0
   }
   ul { padding-left: 20px; } 
  </style>
  <script type="text/javascript">
    var timerStart = Date.now()
  </script>
</head>
<h2>Michael Pierce</h2>
<ul>
  <li>Frontend, UI, Web Developer</li>
  <li>Design and business background</li>
  <li>San Francisco #1032194</li>
  <li>Current client: <a href="http://nimasensor.com">6SensorLabs</a> (devops, graphics, frontend)</li>
  <li>App built with docker, nodejs, express, react, and d3: <a href="/fin">Link</a></li>
  <li>Use <a href="https://activecollab.com">AC</a> for project management and invoicing</li>
  <li>This site loaded in <span class="noJs">(no JS)</span><span class="loadTime"></span> milliseconds</li>
  <li><a href="mailto:hi@mep.im">Say hi</a></li>
  <li><a href="https://github.com/59023g">Github</a></li>

</ul>
<script type="text/javascript">
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    document.querySelector('.noJs').remove();
    var loadTime = Date.now() - timerStart;
    var otherLoad = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    document.querySelector('.loadTime').textContent = loadTime
  }
}
</script>
`
)
