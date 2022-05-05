import unittest

from api.utils import is_valid_hex_str


class TestUtils(unittest.TestCase):

    def test_is_valid_hex_str(self):
        self.assertTrue(is_valid_hex_str("#fff"))
        self.assertTrue(is_valid_hex_str("#ffffff"))
        self.assertFalse(is_valid_hex_str("#fffffff"))
        self.assertFalse(is_valid_hex_str("fffffff"))
        self.assertFalse(is_valid_hex_str("#xpto"))


if __name__ == '__main__':
    unittest.main()
