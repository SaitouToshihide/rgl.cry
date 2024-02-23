##

## library(pryr)
## library(rgl.cry)
## sys.source(path, new.env(parent = globalenv()), chdir = TRUE)

test_that("Does it work with all expected argument variants?", {
  rgl.cry::dp_demo()
  cat("\n")
  lapply(
    c(
      "a", "b", "c", "ra", "rb", "rc",
      "1 0 0", "1 1 0", "1 1 1", "2 1 0", "-1 -1 0",
      "10 20", "30 -45"
    ),
    function(v) {
      cat("align(\"", v, ", silent=TRUE\")\n", sep = "")
      rgl.cry::align(v, silent = TRUE)
      Sys.sleep(1)
    }
  )
})

test_that("calculation works", {
  rgl.cry::dp_demo()
  cat("\n")
  rgl.cry::align("c", silent = TRUE)
  rgl.cry::align("c")
  cat("expected: 0 0 0 (deg)\n")
  rgl.cry::align("1 0")
  cat("expected: 1 0 0 (deg)\n")
  rgl.cry::align("10 0")
  cat("expected: 10 0 0 (deg)\n")
  rgl.cry::align("15 15")
  cat("expected: 15 15 0 (deg)\n")
  return(1)
})
