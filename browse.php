<?php
	include "definicije.php";
	include "tehnikalije.php";
	$job_id = Tehnikalije::check_param((isset($_REQUEST['job_id']) ? $_REQUEST['job_id'] : ""));
	$results_dir = $RESULTS ."/". $job_id;
	$pairwise = (shell_exec("grep PAIRWISE $RESULTS/$job_id/$PAR_FILE") == "" ? 0:1);
	// ce nalozimo stran iz widgeta (PWlib), potem je isset(PW_janez)==true, kar pomeni, 
	// da so direktoriji v results ze nared in da lahko preskocimo pripravo strani.. 
	// PW_janez je POST-an (njegova vrednost ni pomembna), medtem ko so ostali parametri GET-ani !!!
	if (!isset($_REQUEST['PW_janez'])) {
		if (strlen((string) $job_id) == 6) {
			// naredi direktorij z rezultati
			try {
				list($pdb_id, $chain_id) = explode(".", $job_id);
				$form = new Tehnikalije(NULL, NULL, $job_id);
				$arr = Tehnikalije::representative($pdb_id, $chain_id);
				$pdb_id = substr($arr['clus_rep'], 0, 4);
				$chain_id = substr($arr['clus_rep'], 4, 1);
				$form->prepare_db($pdb_id, $chain_id);
			} catch (Exception $e) {
				// zbrisemo direktorij z rezultati
				$form->delete_results_dir();
				echo $e->getMessage();
				exit;
			}
		}
	}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml"> 
	<head>
		<title><?php echo "ProBiS - ".strtoupper($job_id)." Local Structural Similarity Profile"; ?></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
		<meta name="author" content="Tanja" />
		<meta name="description" content="Protein-protein binding site prediction by protein surface structure conservation." />
		<meta name="keywords" content="protein-protein binding sites, structural alignment, protein binding sites, protein interactions, structure conservation, protein binding sites prediction, molecular surface" />

		<meta name="viewport" content="width=device-width, initial-scale=1">

		<link rel="stylesheet" type="text/css" href="libs/bootstrap.min.css">

		<link rel="stylesheet" type="text/css" href="<?php echo "$JQUERYTHEMES"; ?>" />
		<link rel="stylesheet" type="text/css" href="jquery_custom.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo "$JQGRID/css/ui.jqgrid.css"; ?>" />
		<link rel="stylesheet" type="text/css" href="jquery/ui-widgets/css/ui.multiselect.css" />
		<link rel="stylesheet" type="text/css" href="jqalseq/jquery.alignSeq.css" />

		<link rel="stylesheet" type="text/css" href="css/navbar.css"/>

		<link rel="stylesheet" type="text/css" href="jqgrid_custom.css" />
		<link rel="stylesheet" type="text/css" href="results.css" />
		<link rel="stylesheet" type="text/css" href="probis.css" />
		<link rel="stylesheet" type="text/css" href="css/tabela.css" />
				<link rel="stylesheet" type="text/css" href="stil.css"/>

		<link rel="stylesheet" type="text/css" href="css/href.css" />
		<link rel="stylesheet" type="text/css" href="fullscreen.css" />
		<link rel="stylesheet" href="superclick/dist/css/superfish.css" media="screen">
		<link rel="shortcut icon" href="klika.ico" />
		<script type="text/javascript">
			<!-- inicializiramo javascript variable iz PHP -->
			var __bin_address = '<?php echo Tehnikalije::get_host_address(); ?>';
			var __client_ip = '<?php echo Tehnikalije::get_client_ip(); ?>';
			<?php echo "var __jmol = '" . $JMOL . "';\n"; ?>
			<?php echo "var __results_dir = '" . $RESULTS . "/" . $job_id . "';\n"; ?>
			<?php echo "var __pairwise = $pairwise;\n"; ?>
		</script>
		<script src="<?php echo "$JQUERY"; ?>"></script>
		<script src="<?php echo "$JQUERYUI"; ?>"></script>
		<script type="text/javascript" src="libs/bootstrap.min.js"></script>
		<script type="text/javascript" src="<?php echo "$JMOL/JSmol.min.nojq.js"; ?>"></script>
		<script type="text/javascript" src="<?php echo "$JMOL/js/JSmolThree.js"; ?>"></script>
		<script type="text/javascript" src="<?php echo "$JMOL/js/JSmolGLmol.js"; ?>"></script>
		<script type="text/javascript" src="jqform/jquery.form.js"></script>
		<script src="superclick/dist/js/superclick.js"></script>
		<script type="text/javascript" src="jquery/ui-widgets/js/ui.multiselect.js"></script>
		<script src="<?php echo "$JQGRID/js/i18n/grid.locale-en.js"; ?>" type="text/javascript"></script>
		<script src="<?php echo "$JQGRID/js/jquery.jqGrid.min.js"; ?>" type="text/javascript"></script>
		<script src="jqalseq/jquery.alignSeq.js" type="text/javascript"></script>

		<script type="text/javascript" src="<?php echo "$results_dir/init.js"; ?>"></script>
		<script type="text/javascript" src="stdlib.js"></script>
		<script type="text/javascript" src="viewed.js"></script>
		<script type="text/javascript" src="legend.js"></script>
		<script type="text/javascript" src="legend_mini.js"></script>
		<script type="text/javascript" src="convert.js"></script>
		<script type="text/javascript" src="jml.js"></script>
		<script type="text/javascript" src="results.js"></script>
		<script type="text/javascript" src="charmming/modeling.js"></script>
		<script type="text/javascript" src="show_binding_site.js"></script>
		<script type="text/javascript" src="show_aligned_residues.js"></script>
		<script type="text/javascript" src="fullscreen.js"></script>
		<script type="text/javascript" src="ga.js"></script>
	</head>

	<body>

		<nav class="navbar navbar-inverse navbar-static-top" style="background-color:#26396F;font-size:1.1em; padding: 5px 0 5px 0;">
			<div class="container col-md-12">

				<div class="navbar-header" style="padding-left: 5%;">
		    		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span> 
			      	</button>
				</div>

				<div class="collapse navbar-collapse" id="myNavbar">
					<div class="custom-navbar" >
						<ul class="nav navbar-nav">
							<li><a rel="home" href="<?php echo Tehnikalije::get_host_address(); ?>" target="_blank">Home</a></li>
							<li class="dropdown">
								<a class="dropdown-toggle" data-toggle="dropdown" href="#">Download
								<span class="caret"></span></a>
								<ul class="dropdown-menu">
									<li><a href="" onclick="window.open(__bin_address+'?what=parallel', 'blank'); return false;">ProBiS Software (Command Line)</a></li>
									<li><a href="#">ProBiS Plugin (Graphical User Interface)</a></li>
								</ul>
							</li>
							<li><a href="" onclick="window.open(__bin_address+'?what=database', 'blank'); return false;">Database</a></li> 
							<li><a href="" onclick="window.open(__bin_address+'?what=webservices', 'blank'); return false;">RESTful</a></li> 
							<li><a href="" onclick="window.open(__bin_address+'?what=references', 'blank'); return false;">References</a></li> 
							<li><a  href="" onclick="window.open(__bin_address+'?what=charmming', 'blank'); return false;">ProBiS-CHARMMing</a></li> 
							<li class="dropdown">
								<a class="dropdown-toggle" data-toggle="dropdown" href="#">Related Software
								<span class="caret"></span></a>
								<ul class="dropdown-menu">
									<li><a href="http://www.insilab.org/maxclique/" target="_blank">Maximum Clique Algorithm</a></li>
									<li><a href="http://www.insilab.org/lisica/" target="_blank">LiSiCA - Ligand-based Virtual Screening Software</a></li>
								</ul>
							</li>
							<li><a href="" onclick="window.open(__bin_address+'?what=tutorial', 'blank'); return false;">Tutorials</a></li> 
							<li><a href="#">Get Help</a></li>
						</ul>
					</div>
				</div>
	
			</div>
		</nav>


		<?php require("error.php"); ?>

		<!-- alignment table -->
		<div class='alignment_ozadje ui-corner-all' style="top: 20%; left: 60%;" >
			<div class="alignment_header ui-corner-top">
				<span class="alignment_htxt"><b>Alignments Residues</b></span>
				<img src="slike/exit.png" id="alignment_close" alt="close" title="close" />
				<img src="slike/save.png" id="alignment_save" alt="save" title="save" />
				<img src="slike/copy.png" id="alignment_copy" alt="copy" title="copy" />
			</div>
				
			<div class="alignment_content">
				<table id="alignment_residues" cellspacing="0" cellpadding="2"><tbody></tbody></table>
			</div>	
		</div>


		<div class='ui-widget dead-center '>
			<div class='ui-widget-content ui-corner-all shadow fullscreen'>
				<div class="info" style="position: fixed; background-color: #323232; display:none; color: white; padding: 5px; z-index: 2147483647;"></div>
				<div class='ui-helper-clearfix' style='padding:10px'>
					<div class='left-floated'>
						<div id='jmol-applet'>
							<div class='ui-widget-content ui-corner-all'>
								<div style="position:absolute;right:1.2%;top: 2.5%;z-index:9999;  padding: 2px 2px 0 2px; background-color:transparent;" class="ui-corner-all"id="tab_btns">
									<img id="hide_tab" style="cursor:pointer;" title="hide table" src="slike/show-icon.svg" alt="hide" width="20" height="20">
									<img id="gofull" style="cursor:pointer;" title="full screen" src="slike/full_screen.png" alt="full" width="20" height="20">								
								</div>								
								<div class="ui-state-default" id="draggable" style="position:absolute;left:10%;z-index:9999;"></div>

								<?php require("charmming/modeling.php"); ?>
								<div id='jmlfun' style='height:842px;padding:2px'>
								</div>
								<div>
									<!-- jmol controls -->
									<div id='j1Probis' class='ui-state-default' style='border:none; pointer-events: none;'>
										<div id="color_range">
											<div id="color_content">
												<span>Not Conserved</span>
												<div id="color1" class="color_range notclicked">X</div>
												<div id="color2" class="color_range notclicked">X</div>	
												<div id="color3" class="color_range notclicked">X</div>	
												<div id="color4" class="color_range notclicked">X</div>	
												<div id="color5" class="color_range notclicked">X</div>	
												<div id="color6" class="color_range notclicked">X</div>	
												<div id="color7" class="color_range notclicked">X</div>	
												<div id="color8" class="color_range notclicked">X</div>	
												<div id="color9" class="color_range notclicked">X</div>	
												<div id="color10" class="color_range notclicked">X</div>	
												<span>Conserved</span>		
											</div>								
										</div>
										<div id="color_legend">
											<div id="cl_content">
												<span id="cl_protein1"></span>
												<div class="color_legend cl_color1"></div>
												<div class="color_legend cl_color2"></div>
												<span id="cl_protein2"></span>		
											</div>							
										</div>
										<div class='fill-horizontal'>
											<div class='jmiddle-flex' style="pointer-events: auto;">
												<select id='bio-units'></select>
												<button class='download' type='button' style='' title='Download PDB file with all viewed structures'>Download PDB</button>
												<button class='dwnpng' type='button' style='' title='Download picture'>Download PNG</button>
												<button class='bckgrnd' type='button' style='' title=''>Black Background</button>
												<button class='spin' type='button' style='' title=''>Spin</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class='right-floated'>
						<div id='title-bar' style='height:40px;'>
							<div class='ui-widget-header ui-corner-all' >
								<div class='title-text' style='padding:10px'>
									<span class='__QPDB'></span>, Chain&nbsp;<span id='__QCID1'></span>&nbsp;:&nbsp;<span id='__NALI'></span>&nbsp;similar structures
					<!--				<button id='gofull' style='float:right; margin-left:20px; font-size: 0.8em;'>Full Screen</button>			-->					
								</div>
							</div>
						</div>
						<div id='tabs'>
					 		<ul>
								<li class='<?php echo ($pairwise?"ui-helper-hidden":""); ?> ' ><a href='#ligands-tab'><span>Predicted Ligands</span></a></li>
								<li><a href='#simprot-tab'><span>Similar Proteins</span></a></li>
							</ul>
							<div id='ligands-tab'>
						 		<ul>
									<li><a href='#tab-hetero'><span>Small Molecules</span></a></li>
									<li><a href='#tab-protein'><span>Proteins</span></a></li>
									<li><a href='#tab-nucleic'><span>Nucleic Acids</span></a></li>
									<li><a href='#tab-ion'><span>Ions</span></a></li>
						 		</ul>
						 		<div id="tab-hetero"></div>
						 		<div id="tab-protein"></div>
						 		<div id="tab-nucleic"></div>
						 		<div id="tab-ion"></div>
							</div>
							<div id='simprot-tab'>
								<table id="list4"></table>
								<div id="pager9"></div>
							</div>
						</div>
					</div>
				</div>
				
				<div class='ui-widget' style='position:fixed;left:50%;margin-left:0px;top:0px'>
					<div id='loading' class='ui-state-highlight ui-helper-hidden ui-corner-bottom' style='font-weight:bold;padding:5px;z-index:10001;'>
						Loading...
					</div>
					<div id='minimizing' class='ui-state-highlight ui-helper-hidden ui-corner-bottom' style='font-weight:bold;padding:5px;z-index:10001;'>
						Minimization in Progress...
					</div>
				</div>
				
			</div>
		</div>
		
		<div class="row footer_custom" style="margin-top:10px;">
      		<div class="col-sm-6 col-sm-offset-0 col-xs-10 col-xs-offset-1">
				<a style='float:left' target="_blank" href="http://www.nih.gov">
					<img style='border:0px;' src="slike/banner-nihlogo.png"/>
				</a>
			</div>
			<div class="col-sm-6 col-sm-offset-0 col-xs-10 col-xs-offset-1">
				<a style='float:right' target="_blank" href="http://www.ki.si">
					<img style='border:0px;' height='60' src="slike/KI_logo_01.png"/>
				</a>
				<a style='float:right' target="_blank" href="http://www.upr.si">
					<img style='border:0px;' height='60' src="slike/UP.gif"/>
				</a>
			</div>
	    </div>

	</body>
</html>
