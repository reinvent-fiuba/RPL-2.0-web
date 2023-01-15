const testCodeC = `#include <criterion/criterion.h>  // No borrar esto!
#include "api.h"  // Modificar con el nombre de la api que se le entrega al alumno!

Test(misc, testName1) {
    cr_assert(fooNoRepetido() == 1);
}

Test(misc, testName2) {
    cr_assert(barNoRepetido() == 2);
}`;

const testCodePython = `import unittest  # No borrar esto!
import timeout_decorator
import assignment_main # Modificar con el nombre de la api que se le entrega al alumno!

# Accede a las funciones del alumno desde el modulo assignment_main


class TestMethods(unittest.TestCase):

  @timeout_decorator.timeout(5)  # segundos
  def test_1(self):
    self.assertTrue(assignment_main.hola_mundo())

  def test_2(self):
    self.assertTrue(assignment_main.hola_mundo())`;

const testCodeGo = `package main
import (
	"testing"
	"github.com/stretchr/testify/assert"
)`;

module.exports = {
  languages: {
    c: {
      main: "main.c",
      comment: "//",
      extension: ".c",
      testCode: testCodeC,
      testDocs: "https://criterion.readthedocs.io/en/master/assert.html",
    },
    python: {
      main: "assignment_main.py",
      comment: "#",
      extension: ".py",
      testCode: testCodePython,
      testDocs: "https://docs.python.org/3/library/unittest.html#assert-methods",
    },
    go: {
      main: "main.go",
      comment: "//",
      extension: ".go",
      testCode: testCodeGo,
      testDocs: "https://github.com/stretchr/testify",
    },
  },
};
