<?php
$cfg['AllowArbitraryServer'] = true;

$i = 1;
$cfg['Servers'][$i]['host'] = 'portfoliohamriyassine-portfoliohamriyassine.e.aivencloud.com';
$cfg['Servers'][$i]['port'] = '28606';
$cfg['Servers'][$i]['auth_type'] = 'cookie'; // login via interface
$cfg['Servers'][$i]['ssl'] = true;
$cfg['Servers'][$i]['ssl_ca'] = '/etc/phpmyadmin/certs/ca.pem';
