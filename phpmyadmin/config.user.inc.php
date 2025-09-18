<?php
/* On désactive l'hôte arbitraire pour forcer l’usage du serveur préconfiguré */
$cfg['AllowArbitraryServer'] = false;

/* Serveur Aiven préconfiguré */
$i = 1;
$cfg['Servers'][$i]['verbose']   = 'Aiven MySQL';
$cfg['Servers'][$i]['host']      = 'portfoliohamriyassine-portfoliohamriyassine.d.aivencloud.com';
$cfg['Servers'][$i]['port']      = '28606';
$cfg['Servers'][$i]['connect_type'] = 'tcp';
$cfg['Servers'][$i]['auth_type'] = 'cookie';

/* SSL obligatoire sur Aiven */
$cfg['Servers'][$i]['ssl']       = true;
$cfg['Servers'][$i]['ssl_verify'] = true;               // vérifie le CA
$cfg['Servers'][$i]['ssl_ca']    = '/etc/phpmyadmin/certs/ca.pem';  // DOIT exister dans le conteneur

/* (optionnel) augmenter le timeout si réseau lent */
$cfg['LoginCookieValidity'] = 14400;
