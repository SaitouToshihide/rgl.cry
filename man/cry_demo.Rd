% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/cry_demo.R
\name{cry_demo}
\alias{cry_demo}
\title{Examples of using the cry and rgl packages together.}
\usage{
cry_demo(
  file = NULL,
  rf = 1,
  type = "b",
  zoom = 1,
  abc = c(0, 0, 0),
  clipplanes = rbind(c(0, 0, 0, 0))
)
}
\arguments{
\item{file}{Optional file in CIF formats. The file can also be specified by
URL.}

\item{rf}{A positive value indicating the scale factor of atom radius.}

\item{type}{A style of atom displaying such like ball, fill and ball-stick
but ball-stick is not implemented.}

\item{zoom}{A positive value indicating the current scene magnification.}

\item{abc}{A length-3 integer vector of repetitions along the a, b, c axes.}

\item{clipplanes}{A list of numeric vectors representing clip planes. Each
vector should contain four elements (a, b, c, d).  Round the values to one
decimal places before making the final determination in the internal process.}
}
\value{
An integer the device number of the currently window.
}
\description{
Read a file in CIF formats, set the parameters, calculates them, and draws
the crystal structure with an axis widget.
}
\details{
If no file argument is provided, and \code{dp_demo()} has been opened without
paired \code{cry_demo()}, the CIF parameters of already opened \code{dp_demo()} will be
used.
}
\examples{
cry_demo()

cry_demo(system.file("orthorhombic_p.cif", package = "rgl.cry"))

cry_demo(system.file("rhombohedral_r.cif", package = "rgl.cry"), abc = c(1,1,1),
  clipplanes = rbind(c(2.885490, 4.158112, -3.374928, -37.01),
                      c(2.885490, -5.082574, 1.687449, -37.01),
                      c(-5.7709802, 0.9244616, 1.6874797, -37.01),
                      c(-2.885490, -4.158112, 3.374928, -37.01),
                      c(-2.885490, 5.082574, -1.687449, -37.01),
                      c(5.7709802, -0.9244616, -1.6874797, -37.01),
                      c(5.771090, 8.316383, 15.180433, -332.92),
                      c(-5.771090, -8.316383, -15.180433, 0.01)))
\donttest{
if (interactive()) {
  cry_demo(file, type = "fill", zoom = 0.5)
  cry_demo("https://www.crystallography.net/cod/foo.cif")


  ## A rhombohedral crystal.
  cry_demo(system.file("rhombohedral_r.cif", package = "rgl.cry"))

  ## Extract crystal structure data from the internal processing of the package.
  library(pryr)
  lCIF <- rgl.cry:::pkg$inst[[nrow(rgl.cry:::pkg$inst), "lCIF"]]
  a <- lCIF$HEADER$CELL$A$VAL
  b <- lCIF$HEADER$CELL$B$VAL
  c <- lCIF$HEADER$CELL$C$VAL
  aa <- lCIF$HEADER$CELL$ALPHA$VAL # degree
  bb <- lCIF$HEADER$CELL$BETA$VAL
  cc <- lCIF$HEADER$CELL$GAMMA$VAL
  mat02 <- cry::xtal_mat02(a, b, c, aa, bb, cc)

  ea1 <- as.numeric(c(1, 0, 0) \%*\% mat02) # lattice vector
  ea2 <- as.numeric(c(0, 1, 0) \%*\% mat02)
  ea3 <- as.numeric(c(0, 0, 1) \%*\% mat02)
  ec3 <- ea1 + ea2 + ea3  # c-axis in a hexagonal crystal.

  ## a_hex is calculated as a - b, b_hex as b - c, and one of the clip planes is denoted as
  ## (a_hex + (a_hex + b_hex)) / 2 = a - b + a - b + b - c = 2a - b - c = a - (b + c) / 2.
  cp1 <- ea1 - (ea2 + ea3)/2
  cp2 <- ea2 - (ea3 + ea1)/2
  cp3 <- ea3 - (ea1 + ea2)/2

  cry_demo(system.file("rhombohedral_r.cif", package = "rgl.cry"), abc = c(1,1,1),
         clipplanes = rbind(
           c(cp1, -crossprod(cp1)),
           c(cp2, -crossprod(cp2)),
           c(cp3, -crossprod(cp3)),
           c(-cp1, -crossprod(cp1)),
           c(-cp2, -crossprod(cp2)),
           c(-cp3, -crossprod(cp3)),
           c(ec3, -crossprod(ec3)),
           c(-ec3, 0)))
}
}
}
