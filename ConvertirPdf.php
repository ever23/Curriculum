<?php

/*
 * Copyright (C) 2016 Enyerber Franco
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  
 */



include("vendor/autoload.php");
$basedir = dirname(__FILE__) . "/";
/**
 * Configuraciones para cargar HTML5 css, fuentes, javascripts y archivos remotos
 * permitiendo que Dompdf funcione exelente con boostrap
 */
$DomPdfConfig = new \Dompdf\Options();
$DomPdfConfig->setIsHtml5ParserEnabled(true);
$DomPdfConfig->setIsRemoteEnabled(true);
$DomPdfConfig->setIsJavascriptEnabled(true);
$DomPdfConfig->setIsFontSubsettingEnabled(true);
$DomPdfConfig->setDefaultMediaType("dompdf");

$domPdf = new \Dompdf\Dompdf($DomPdfConfig);

/**
 * definiendo el host
 */
$domPdf->setBaseHost($_SERVER['HTTP_HOST']);
/**
 * el directorio base esto para los css, js e imagenes 
 */
$domPdf->setBasePath($basedir);
$domPdf->setPaper("letter", "legal");
/**
 * cargo el html del curriculum 
 */
$domPdf->loadHtml(file_get_contents($basedir . "index.html"));
/**
 * agrego una etiqueta link con la referencia css especial para Dompdf
 */
$head = $domPdf->getDom()->getElementsByTagName('head');


$node = $domPdf->getDom()->createElement("link");
$node->setAttribute('rel', "stylesheet");
$node->setAttribute('href', "css/mediaDompdf.css");
$head->item(0)->appendChild($node);
/**
 * lectura de dompdf de los componentes de la pagina
 */
$domPdf->render();
/**
 * salida del pdf 
 */
$cv = $domPdf->output();
/**
 *  guardo el archivo
 */
file_put_contents("Curriculum Enyerber Franco.pdf", $cv);
/**
 * y por ultimo lo muestro
 */
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="Curriculum Enyerber Franco.pdf"');
header('Cache-Control: private, max-age=0, must-revalidate');
header('Pragma: public');

echo $cv;
