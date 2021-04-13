export default {
    pt: {
        functions: {
            abs: '<b>abs(x)</b> Retorna o valor absoluto de <em>x</em>',
            acos: '<i>acos(x)</i>: Returns inverse cosine of <i>x</i>',
            add_months:
                '<i>add_months(data, x)</i>: Retorna a data que é <i>x</i> meses após <i>data</i>.',
            //  "approx_count_distinct": "<i>approx_count_distinct(attr)</i>: Aggregate function: returns a new Column for approximate distinct count of column col.",
            array:
                '<i>array(list)</i>: Creates a new array column from a list of column names (string) or list of <i>Column</i> expressions that have the same data type.',
            array_contains:
                '<i>array_contains(column, value)</i>: Returns null if the array is null, true if the array contains the given value, and false otherwise.',
            array_distinct:
                '<i>array_distinct(column)</i>: Removes duplicate values from the array. ',
            array_except:
                '<i>array_except(col1, col2)</i>: Returns an array of the elements in col1 but not in col2, without duplicates.',
            array_intersect: '<i>array_intersect(x)</i>: Returns an array of the elements in the intersection of col1 and col2, without duplicates.',
            array_join: '<i>array_join(x)</i>: Concatenates the elements of <i>column</i> using the <i>delimiter</i>. Null values are replaced with <i>null_replacement</i> if set, otherwise they are ignored.',
            array_max: '<i>array_max(x)</i>: Returns the maximum value of the array.',
            array_min: '<i>array_min(x)</i>: Returns the minimum value of the array.',
            array_position:
                '<i>array_position(col, value)</i>: Locates the position of the first occurrence of the given <i>value</i> in the given array. Returns null if either of the arguments are null.',
            array_remove:
                "<i>array_remove(col, element)</i>: Remove all elements that equal to <i>element</i> from the given array in <i>col</i>.",
            array_repeat:
                "<i>array_repeat(col, count)</i>: creates an array containing a column repeated <i>count</i> times.",
            array_sort:
                "<i>array_sort(col)</i>: sorts the input array in ascending order. The elements of the input array must be orderable. Null elements will be placed at the end of the returned array.",
            array_union:
                '<i>array_union(col1, col2)</i>: Returns an array of the elements in the union of col1 and col2, without duplicates.',
            arrays_overlap:
                '<i>arrays_overlap(col1, col2)</i>: Returns <i>true</i> if the arrays contain any common non-null element; if not, returns null if both the arrays are non-empty and any of them contains a null element; returns false otherwise. ',
            arrays_zip:
                "<i>arrays_zip(col1, col2)</i>: Returns a merged array of structs in which the N-th struct contains all N-th values of input arrays. ",
            // asc:
            //   '<i>asc(x)</i>: Returns a sort expression based on the ascending order of the given column name.',
            //  "asc_nulls_first": "<i>asc_nulls_first(x)</i>: Returns a sort expression based on the ascending order of the given column name, and null values return before non-null values.",
            //  "asc_nulls_last": "<i>asc_nulls_last(x)</i>: Returns a sort expression based on the ascending order of the given column name, and null values appear after non-null values.",
            ascii:
                '<i>ascii(str)</i>: Computes the numeric value of the first character of the string column.',
            asin: '<i>asin(col)</i>: Returns the inverse sine of <i>col</i>.',
            atan: '<i>atan(col)</i>: Returns the inverse tangent of <i>col</i>.',
            atan2:
                '<i>atan2(col1, col2)</i>: Returns the the <i>theta</i> component of the point (</>r</i>, <i>theta</i>) in polar coordinates that corresponds to the point (<i>x</i>, <i>y</i>) in Cartesian coordinates, as if computed by <i>java.lang.Math.atan2()</i>',

            base64:
                '<i>base64(col)</i>: Computes the BASE64 encoding of a binary column and returns it as a string column.',
            basestring:
                "<i>basestring(x)</i>: str(object='') -> strstr(bytes_or_buffer[, encoding[, errors]]) -> strCreate a new string object from the given object. If encoding orerrors is specified, then the object must expose a data bufferthat will be decoded using the given encoding and error handler.Otherwise, returns the result of object.__str__() (if defined)or repr(object).encoding defaults to sys.getdefaultencoding().errors defaults to 'strict'.",
            bin:
                "<i>bin(x)</i>: Returns the string representation of the binary value of the given column. >>> df.select(bin(df.age).alias('c')).collect() [Row(c='10'), Row(c='101')] .. ",
            bitwiseNOT: '<i>bitwiseNOT(x)</i>: Computes bitwise not.',
            //  "blacklist": "<i>blacklist(x)</i>: Built-in mutable sequence.If no argument is given, the constructor creates a new empty list.The argument must be an iterable if specified.",
            //  "broadcast": "<i>broadcast(x)</i>: Marks a DataFrame as small enough for use in broadcast joins.",
            bround:
                '<i>bround(x, scale)</i>: Round the given value to <i>scale</i> decimal places using HALF_EVEN rounding mode if <i>scale</i> >= 0 or at integral part when <i>scale</i> < 0.',
            cbrt: '<i>cbrt(x)</i>: Computes the cube-root of the given value.',
            ceil: '<i>ceil(x)</i>: Computes the ceiling of the given value.',
            coalesce:
                '<i>coalesce(x)</i>: <i>coalesce(v1, v2, ..., vn)</i>: Returns the first value that is not null.',
            // col:
            //   '<i>col(x)</i>: Returns a :class:`Column</i> based on the given column name.',

            // column:
            //   '<i>column(x)</i>: Returns a :class:`Column</i> based on the given column name.',
            concat:
                '<i>concat(col1, col2, ..., coln)</i>: Concatenates multiple input columns together into a single column. The function works with strings, binary and compatible array columns.',
            concat_ws:
                '<i>concat_ws(separator, value1, value2, ..., valuen)</i>: Concatenates multiple input string columns together into a single string column, using the given separator. ',
            conv:
                "<i>conv(x)</i>: Convert a number in a string column from one base to another. >>> df = spark.createDataFrame([(\"010101\",)], ['n']) >>> df.select(conv(df.n, 2, 16).alias('hex')).collect() [Row(hex='15')] .. ",
            cos:
                '<i>cos(col)</i>: Returns the cosine of the angle (in radians), as if computed by <i>java.lang.Math.cos()</i>.',
            cosh:
                '<i>cosh(col)</i>: Returns the hyperbolic cosine of the angle, as if computed by <i>java.lang.Math.cosh()</i>.',
            crc32:
                '<i>crc32(x)</i>: Calculates the cyclic redundancy check value (CRC32) of a binary column and returns the value as a bigint.',
            create_map:
                "<i>create_map(x)</i>: Creates a new map column. :param cols: list of column names (string) or list of :class:`Column</i> expressions that are grouped as key-value pairs, e.g. (key1, value1, key2, value2, ...). >>> df.select(create_map('name', 'age').alias(\"map\")).collect() [Row(map={'Alice': 2}), Row(map={'Bob': 5})] >>> df.select(create_map([df.name, df.age]).alias(\"map\")).collect() [Row(map={'Alice': 2}), Row(map={'Bob': 5})] .. versionadded:: 2.0",
            current_date:
                '<i>current_date(x)</i>: Returns the current date as a :class:`DateType</i> column. .. ',
            current_timestamp:
                '<i>current_timestamp(x)</i>: Returns the current timestamp as a <i>TimestampType</i> column.',
            date_add:
                '<i>date_add(start, days)</i>: Returns the date that is <i>days</i> days after <i>start</i>.',
            date_format:
                "<i>date_format(date, format)</i>: Converte uma data para uma representação em texto usando um formato especificado como segundo argumento. Um formato poderia ser, por exemplo, <i>dd-MM-yyyy</i> e retornaria um texto como '18-03-1993'. O formato segue a convenção da classe Java <i><a href='http://docs.oracle.com/javase/tutorial/i18n/format/simpleDateFormat.html'>java.text.SimpleDateFormat</a></i>.",
            date_sub:
                '<i>date_sub(start, days)</i>: Returns the date that is <i>days</i> days before <i>start</i>.',
            date_trunc:
                "<i>date_trunc(date, format)</i>: Retorna a data truncada para a unidade especificada por <i>format</i> ('year', 'yyyy', 'yy', 'month', 'mon', 'mm', 'day', 'dd', 'hour', 'minute', 'second', 'week', 'quarter').",
            datediff:
                '<i>datediff(start, end)</i>: Returns the number of days from <i>start</i> to <i>end.',
            dayofmonth:
                "<i>dayofmonth(x)</i>: Extract the day of the month of a given date as integer.",
            dayofweek:
                "<i>dayofweek(x)</i>: Extract the day of the week of a given date as integer.",
            dayofyear:
                "<i>dayofyear(x)</i>: Extract the day of the year of a given date as integer.",
            decode:
                "<i>decode(x)</i>: Computes the first argument into a string from a binary using the provided character set (one of 'US-ASCII', 'ISO-8859-1', 'UTF-8', 'UTF-16BE', 'UTF-16LE', 'UTF-16').",
            degrees:
                '<i>degrees(x)</i>: Converts an angle measured in radians to an approximately equivalent angle measured in degrees. :param col: angle in radians Returns the angle in degrees, as if computed by <i>java.lang.Math.toDegrees()</i>.',
            // desc:
            //   '<i>desc(x)</i>: Returns a sort expression based on the descending order of the given column name.',
            // desc_nulls_first:
            //   '<i>desc_nulls_first(x)</i>: Returns a sort expression based on the descending order of the given column name, and null values appear before non-null values.',
            // desc_nulls_last:
            //   '<i>desc_nulls_last(x)</i>: Returns a sort expression based on the descending order of the given column name, and null values appear after non-null values.. ',
            element_at:
                '<i>element_at(x)</i>: Returns element of array at given index in extraction if col is array. Returns value for the given key in extraction if col is map. :param col: name of column containing array or map :param extraction: index to check for in array or key to check for in map .. note:: The position is not zero based, but 1 based index. >>> df = spark.createDataFrame([(["a", "b", "c"],), ([],)], [\'data\']) >>> df.select(element_at(df.data, 1)).collect() [Row(element_at(data, 1)=\'a\'), Row(element_at(data, 1)=None)] >>> df = spark.createDataFrame([({"a": 1.0, "b": 2.0},), ({},)], [\'data\']) >>> df.select(element_at(df.data, lit("a"))).collect() [Row(element_at(data, a)=1.0), Row(element_at(data, a)=None)] .. ',
            encode:
                "<i>encode(x)</i>: Computes the first argument into a binary from a string using the provided character set (one of 'US-ASCII', 'ISO-8859-1', 'UTF-8', 'UTF-16BE', 'UTF-16LE', 'UTF-16'). .. ",
            exp: '<i>exp(x)</i>: Computes the exponential of the given value.',
            explode:
                '<i>explode(x)</i>: Returns a new row for each element in the given array or map. >>> from pyspark.sql import Row >>> eDF = spark.createDataFrame([Row(a=1, intlist=[1,2,3], mapfield={"a": "b"})]) >>> eDF.select(explode(eDF.intlist).alias("anInt")).collect() [Row(anInt=1), Row(anInt=2), Row(anInt=3)] >>> eDF.select(explode(eDF.mapfield).alias("key", "value")).show() +---+-----+ |key|value| +---+-----+ | a| b| +---+-----+ .. ',
            explode_outer:
                '<i>explode_outer(x)</i>: Returns a new row for each element in the given array or map. Unlike explode, if the array/map is null or empty then null is produced. >>> df = spark.createDataFrame( .[(1, ["foo", "bar"], {"x": 1.0}), (2, [], {}), (3, None, None)], .("id", "an_array", "a_map") .) >>> df.select("id", "an_array", explode_outer("a_map")).show() +---+----------+----+-----+ | id| an_array| key|value| +---+----------+----+-----+ | 1|[foo, bar]| x| 1.0| | 2| []|null| null| | 3| null|null| null| +---+----------+----+-----+ >>> df.select("id", "a_map", explode_outer("an_array")).show() +---+----------+----+ | id| a_map| col| +---+----------+----+ | 1|[x -> 1.0]| foo| | 1|[x -> 1.0]| bar| | 2| []|null| | 3| null|null| +---+----------+----+ .. versionadded:: 2.3',
            expm1:
                '<i>expm1(x)</i>: Computes the exponential of the given value minus one.',
            // expr:
            //   '<i>expr(x)</i>: Parses the expression string into the column that it represents >>> df.select(expr("length(name)")).collect() [Row(length(name)=5), Row(length(name)=3)] .. ',
            factorial:
                "<i>factorial(x)</i>: Computes the factorial of the given value. >>> df = spark.createDataFrame([(5,)], ['n']) >>> df.select(factorial(df.n).alias('f')).collect() [Row(f=120)] .. ",
            flatten:
                "<i>flatten(x)</i>: creates a single array from an array of arrays. If a structure of nested arrays is deeper than two levels, only one level of nesting is removed. :param col: name of column or expression >>> df = spark.createDataFrame([([[1, 2, 3], [4, 5], [6]],), ([None, [4, 5]],)], ['data']) >>> df.select(flatten(df.data).alias('r')).collect() [Row(r=[1, 2, 3, 4, 5, 6]), Row(r=None)] .. ",
            floor: '<i>floor(x)</i>: Computes the floor of the given value.',
            format_number:
                "<i>format_number(x, decimal_places)</i>: Formats the number <i>x</i> to a format like '#,--#,--#.--', rounded to d decimal places with HALF_EVEN round mode, and returns the result as a string.",
            format_string:
                "<i>format_string(x)</i>: Formats the arguments in printf-style and returns the result as a string column. :param format: string that can contain embedded format tags and used as result column's value :param cols: list of column names (string) or list of :class:`Column</i> expressions to be used in formatting >>> df = spark.createDataFrame([(5, \"hello\")], ['a', 'b']) >>> df.select(format_string('%d %s', df.a, df.b).alias('v')).collect() [Row(v='5 hello')] .. ",
            from_json:
                '<i>from_json(x)</i>: Parses a column containing a JSON string into a :class:`MapType</i> with :class:`StringType</i> as keys type, :class:`StructType</i> or :class:`ArrayType</i> with the specified schema. Returns <i>null</i>, in the case of an unparseable string. :param col: string column in json format :param schema: a StructType or ArrayType of StructType to use when parsing the json column. :param options: options to control parsing. accepts the same options as the json datasource .. note:: Since Spark 2.3, the DDL-formatted string or a JSON format string is also supported for <i>`schema``. >>> from pyspark.sql.types import * >>> data = [(1, \'\'\'{"a": 1}\'\'\')] >>> schema = StructType([StructField("a", IntegerType())]) >>> df = spark.createDataFrame(data, ("key", "value")) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=Row(a=1))] >>> df.select(from_json(df.value, "a INT").alias("json")).collect() [Row(json=Row(a=1))] >>> df.select(from_json(df.value, "MAP<STRING,INT>").alias("json")).collect() [Row(json={\'a\': 1})] >>> data = [(1, \'\'\'[{"a": 1}]\'\'\')] >>> schema = ArrayType(StructType([StructField("a", IntegerType())])) >>> df = spark.createDataFrame(data, ("key", "value")) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=[Row(a=1)])] >>> schema = schema_of_json(lit(\'\'\'{"a": 0}\'\'\')) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=Row(a=1))] >>> data = [(1, \'\'\'[1, 2, 3]\'\'\')] >>> schema = ArrayType(IntegerType()) >>> df = spark.createDataFrame(data, ("key", "value")) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=[1, 2, 3])] .. versionadded:: 2.1',
            from_unixtime:
                "<i>from_unixtime(timestamp)</i>: Converts the number of seconds from unix epoch (1970-01-01 00:00:00 UTC) to a string representing the timestamp of that moment in the current system time zone in the given format.",
            from_utc_timestamp:
                "<i>from_utc_timestamp(timestamp)</i>: This is a common function for databases supporting TIMESTAMP WITHOUT TIMEZONE. This function takes a timestamp which is timezone-agnostic, and interprets it as a timestamp in UTC, and renders that timestamp as a timestamp in the given time zone. However, timestamp in Spark represents number of microseconds from the Unix epoch, which is not timezone-agnostic. So in Spark this function just shift the timestamp value from UTC timezone to the given timezone. This function may return confusing result if the input is a string with timezone, e.g. '2018-03-13T06:18:23+00:00'. The reason is that, Spark firstly cast the string to timestamp according to the timezone in the string, and finally display the result by converting the timestamp to string according to the session local timezone.",
            //  "functools": "<i>functools(x)</i>: functools.py - Tools for working with functions and callable objects",
            get_json_object:
                "<i>get_json_object(x)</i>: Extracts json object from a json string based on json path specified, and returns json string of the extracted json object. It will return null if the input json string is invalid. :param col: string column in json format :param path: path to the json object to extract >>> data = [(\"1\", '''{\"f1\": \"value1\", \"f2\": \"value2\"}'''), (\"2\", '''{\"f1\": \"value12\"}''')] >>> df = spark.createDataFrame(data, (\"key\", \"jstring\")) >>> df.select(df.key, get_json_object(df.jstring, '$.f1').alias(\"c0\"), \\ . get_json_object(df.jstring, '$.f2').alias(\"c1\") ).collect() [Row(key='1', c0='value1', c1='value2'), Row(key='2', c0='value12', c1=None)] .. ",
            greatest:
                "<i>greatest(x)</i>: Returns the greatest value of the list of column names, skipping null values. This function takes at least 2 parameters. It will return null iff all parameters are null. >>> df = spark.createDataFrame([(1, 4, 3)], ['a', 'b', 'c']) >>> df.select(greatest(df.a, df.b, df.c).alias(\"greatest\")).collect() [Row(greatest=4)] .. ",
            hash:
                '<i>hash(cols)</i>: Calculates the hash code of given columns, and returns the result as an int column.',
            hex:
                "<i>hex(x)</i>: Computes hex value of the given column, which could be :class:`pyspark.sql.types.StringType</i>, :class:`pyspark.sql.types.BinaryType</i>, :class:`pyspark.sql.types.IntegerType</i> or :class:`pyspark.sql.types.LongType`. >>> spark.createDataFrame([('ABC', 3)], ['a', 'b']).select(hex('a'), hex('b')).collect() [Row(hex(a)='414243', hex(b)='3')] .. ",
            hour:
                "<i>hour(date)</i>: Extract the hours of a given <i>date</i> as integer.",
            hypot:
                '<i>hypot(a, b)</i>: Computes <i>sqrt(a^2 + b^2)</i> without intermediate overflow or underflow.',
            // ignore_unicode_prefix:
            //   "<i>ignore_unicode_prefix(x)</i>: Ignore the 'u' prefix of string in doc tests, to make it works in both python 2 and 3 ",
            initcap:
                "<i>initcap(x)</i>: Translate the first letter of each word to upper case in the sentence. >>> spark.createDataFrame([('ab cd',)], ['a']).select(initcap(\"a\").alias('v')).collect() [Row(v='Ab Cd')] .. ",
            // input_file_name:
            //   '<i>input_file_name(x)</i>: Creates a string column for the file name of the current Spark task. .. ',
            instr:
                "<i>instr(x)</i>: Locate the position of the first occurrence of substr column in the given string. Returns null if either of the arguments are null. .. note:: The position is not zero based, but 1 based index. Returns 0 if substr could not be found in str. >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(instr(df.s, 'b').alias('s')).collect() [Row(s=2)] .. ",
            isnan:
                '<i>isnan(column)</i>: Returns <i>true</i> iff the <i>column</i> is <i>NaN</i> (not a number). ',
            isnull:
                '<i>isnull(x)</i>: Returns <i>true</i> iff the <i>column</i> is <i>null</i>.',
            json_tuple:
                "<i>json_tuple(x)</i>: Creates a new row for a json column according to the given field names. :param col: string column in json format :param fields: list of fields to extract >>> data = [(\"1\", '''{\"f1\": \"value1\", \"f2\": \"value2\"}'''), (\"2\", '''{\"f1\": \"value12\"}''')] >>> df = spark.createDataFrame(data, (\"key\", \"jstring\")) >>> df.select(df.key, json_tuple(df.jstring, 'f1', 'f2')).collect() [Row(key='1', c0='value1', c1='value2'), Row(key='2', c0='value12', c1=None)] .. ",

            last_day:
                "<i>last_day(date)</i>: Returns the last day of the month which the given <i>date</i> belongs to.",
            // lead:
            //   '<i>lead(x)</i>: Window function: returns the value that is <i>offset</i> rows after the current row, and <i>defaultValue</i> if there is less than <i>offset</i> rows after the current row. For example, an <i>offset</i> of one will return the next row at any given point in the window partition. This is equivalent to the LEAD function in SQL. :param col: name of column or expression :param count: number of row to extend :param default: default value .. ',
            least:
                "<i>least(x)</i>: Returns the least value of the list of column names, skipping null values. This function takes at least 2 parameters. It will return null iff all parameters are null. >>> df = spark.createDataFrame([(1, 4, 3)], ['a', 'b', 'c']) >>> df.select(least(df.a, df.b, df.c).alias(\"least\")).collect() [Row(least=1)] .. ",
            length:
                "<i>length(x)</i>: Computes the character length of string data or number of bytes of binary data. The length of character data includes the trailing spaces. The length of binary data includes binary zeros. >>> spark.createDataFrame([('ABC ',)], ['a']).select(length('a').alias('length')).collect() [Row(length=4)] .. ",
            levenshtein:
                "<i>levenshtein(x)</i>: Computes the Levenshtein distance of the two given strings. >>> df0 = spark.createDataFrame([('kitten', 'sitting',)], ['l', 'r']) >>> df0.select(levenshtein('l', 'r').alias('d')).collect() [Row(d=3)] .. ",
            lit:
                "<i>lit(x)</i>: Creates a :class:`Column</i> of literal value. >>> df.select(lit(5).alias('height')).withColumn('spark_user', lit(True)).take(1) [Row(height=5, spark_user=True)] .. ",
            locate:
                "<i>locate(x)</i>: Locate the position of the first occurrence of substr in a string column, after position pos. .. note:: The position is not zero based, but 1 based index. Returns 0 if substr could not be found in str. :param substr: a string :param str: a Column of :class:`pyspark.sql.types.StringType</i> :param pos: start position (zero based) >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(locate('b', df.s, 1).alias('s')).collect() [Row(s=2)] .. ",
            log:
                "<i>log(x, y)</i>: Returns the first argument-based (<i>x</i>) logarithm of the second argument (<i>y</i>) . If there is only one argument, then this takes the natural logarithm of the argument. ",
            log10:
                '<i>log10(x)</i>: Computes the logarithm of the given value in Base 10.',
            log1p:
                '<i>log1p(x)</i>: Computes the natural logarithm of the given value plus one.',
            log2:
                "<i>log2(x)</i>: Returns the base-2 logarithm of the argument.",
            lower: '<i>lower(x)</i>: Converts a string column to lower case.',
            lpad:
                "<i>lpad(x)</i>: Left-pad the string column to width <i>len</i> with <i>pad`. >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(lpad(df.s, 6, '#').alias('s')).collect() [Row(s='##abcd')] .. ",
            ltrim:
                '<i>ltrim(x)</i>: Trim the spaces from left end for the specified string value.',
            map_concat:
                '<i>map_concat(x)</i>: Returns the union of all the given maps. :param cols: list of column names (string) or list of :class:`Column</i> expressions >>> from pyspark.sql.functions import map_concat >>> df = spark.sql("SELECT map(1, \'a\', 2, \'b\') as map1, map(3, \'c\', 1, \'d\') as map2") >>> df.select(map_concat("map1", "map2").alias("map3")).show(truncate=False) +--------------------------------+ |map3  | +--------------------------------+ |[1 -> a, 2 -> b, 3 -> c, 1 -> d]| +--------------------------------+ .. ',
            map_from_arrays:
                "<i>map_from_arrays(x)</i>: Creates a new map from two arrays. :param col1: name of column containing a set of keys. All elements should not be null :param col2: name of column containing a set of values >>> df = spark.createDataFrame([([2, 5], ['a', 'b'])], ['k', 'v']) >>> df.select(map_from_arrays(df.k, df.v).alias(\"map\")).show() +----------------+ | map| +----------------+ |[2 -> a, 5 -> b]| +----------------+ .. ",
            map_from_entries:
                '<i>map_from_entries(x)</i>: Returns a map created from the given array of entries. :param col: name of column or expression >>> from pyspark.sql.functions import map_from_entries >>> df = spark.sql("SELECT array(struct(1, \'a\'), struct(2, \'b\')) as data") >>> df.select(map_from_entries("data").alias("map")).show() +----------------+ | map| +----------------+ |[1 -> a, 2 -> b]| +----------------+ .. ',
            map_keys:
                '<i>map_keys(x)</i>: Returns an unordered array containing the keys of the map. :param col: name of column or expression >>> from pyspark.sql.functions import map_keys >>> df = spark.sql("SELECT map(1, \'a\', 2, \'b\') as data") >>> df.select(map_keys("data").alias("keys")).show() +------+ | keys| +------+ |[1, 2]| +------+ .. versionadded:: 2.3',
            map_values:
                '<i>map_values(x)</i>: Returns an unordered array containing the values of the map. :param col: name of column or expression >>> from pyspark.sql.functions import map_values >>> df = spark.sql("SELECT map(1, \'a\', 2, \'b\') as data") >>> df.select(map_values("data").alias("values")).show() +------+ |values| +------+ |[a, b]| +------+ .. versionadded:: 2.3',
            md5:
                "<i>md5(x)</i>: Calculates the MD5 digest and returns the value as a 32 character hex string. >>> spark.createDataFrame([('ABC',)], ['a']).select(md5('a').alias('hash')).collect() [Row(hash='902fbdd2b1df0c4f70b4a5d23525e932')] .. ",

            minute:
                "<i>minute(date)</i>: Extract the minutes of a given <i>date</i> as integer.",
            monotonically_increasing_id:
                "<i>monotonically_increasing_id(x)</i>: A column that generates monotonically increasing 64-bit integers. The generated ID is guaranteed to be monotonically increasing and unique, but not consecutive. The current implementation puts the partition ID in the upper 31 bits, and the record number within each partition in the lower 33 bits. The assumption is that the data frame has less than 1 billion partitions, and each partition has less than 8 billion records. .. note:: The function is non-deterministic because its result depends on partition IDs. As an example, consider a :class:`DataFrame</i> with two partitions, each with 3 records. This expression would return the following IDs: 0, 1, 2, 8589934592 (1L << 33), 8589934593, 8589934594. >>> df0 = sc.parallelize(range(2), 2).mapPartitions(lambda x: [(1,), (2,), (3,)]).toDF(['col1']) >>> df0.select(monotonically_increasing_id().alias('id')).collect() [Row(id=0), Row(id=1), Row(id=2), Row(id=8589934592), Row(id=8589934593), Row(id=8589934594)] .. ",
            month:
                "<i>month(date)</i>: Extract the month of a given <i>date</i> as integer.",
            months_between:
                "<i>months_between(date1, date2, [roundOff])</i>: Returns number of months between dates <i>date1</i> and <i>date2</i>. If <i>date1</i> is later than <i>date2</i>, then the result is positive. If <i>date1</i> and <i>date2</i> are on the same day of month, or both are the last day of month, returns an integer (time of day will be ignored). The result is rounded off to 8 digits unless <i>roundOff</i> is set to <i>0<i>. ",
            nanvl:
                '<i>nanvl(x)</i>: Returns col1 if it is not NaN, or col2 if col1 is NaN. Both inputs should be floating point columns (:class:`DoubleType</i> or :class:`FloatType`). >>> df = spark.createDataFrame([(1.0, float(\'nan\')), (float(\'nan\'), 2.0)], ("a", "b")) >>> df.select(nanvl("a", "b").alias("r1"), nanvl(df.a, df.b).alias("r2")).collect() [Row(r1=1.0, r2=1.0), Row(r1=2.0, r2=2.0)] .. ',
            next_day:
                '<i>next_day(date, dayOfWeek)</i>: Returns the first date which is later than the value of the <i>date</i> column. The <i>dayOfWeek</i> parameter is case insensitive, and accepts: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun".',

            //  "pandas_udf": "<i>pandas_udf(x)</i>: Creates a vectorized user defined function (UDF). :param f: user-defined function. A python function if used as a standalone function :param returnType: the return type of the user-defined function. The value can be either a :class:`pyspark.sql.types.DataType</i> object or a DDL-formatted type string. :param functionType: an enum value in :class:`pyspark.sql.functions.PandasUDFType`.  Default: SCALAR. .. note:: Experimental The function type of the UDF can be one of the following: 1. SCALAR A scalar UDF defines a transformation: One or more <i>pandas.Series</i> -> A <i>pandas.Series`. The length of the returned <i>pandas.Series</i> must be of the same as the input <i>pandas.Series`. :class:`MapType</i>, :class:`StructType</i> are currently not supported as output types. Scalar UDFs are used with :meth:`pyspark.sql.DataFrame.withColumn</i> and :meth:`pyspark.sql.DataFrame.select`. >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> from pyspark.sql.types import IntegerType, StringType >>> slen = pandas_udf(lambda s: s.str.len(), IntegerType()) # doctest: +SKIP >>> @pandas_udf(StringType()) # doctest: +SKIP .def to_upper(s): .return s.str.upper() .>>> @pandas_udf(\"integer\", PandasUDFType.SCALAR) # doctest: +SKIP .def add_one(x): .return x + 1 .>>> df = spark.createDataFrame([(1, \"John Doe\", 21)], . (\"id\", \"name\", \"age\")) # doctest: +SKIP >>> df.select(slen(\"name\").alias(\"slen(name)\"), to_upper(\"name\"), add_one(\"age\")) \\ ..show() # doctest: +SKIP +----------+--------------+------------+ |slen(name)|to_upper(name)|add_one(age)| +----------+--------------+------------+ | 8| JOHN DOE| 22| +----------+--------------+------------+ .. note:: The length of <i>pandas.Series</i> within a scalar UDF is not that of the whole input column, but is the length of an internal batch used for each call to the function. Therefore, this can be used, for example, to ensure the length of each returned <i>pandas.Series</i>, and can not be used as the column length. 2. GROUPED_MAP A grouped map UDF defines transformation: A <i>pandas.DataFrame</i> -> A <i>pandas.DataFrame</i> The returnType should be a :class:`StructType</i> describing the schema of the returned <i>pandas.DataFrame`. The column labels of the returned <i>pandas.DataFrame</i> must either match the field names in the defined returnType schema if specified as strings, or match the field data types by position if not strings, e.g. integer indices. The length of the returned <i>pandas.DataFrame</i> can be arbitrary. Grouped map UDFs are used with :meth:`pyspark.sql.GroupedData.apply`. >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) # doctest: +SKIP >>> @pandas_udf(\"id long, v double\", PandasUDFType.GROUPED_MAP) # doctest: +SKIP .def normalize(pdf): .v = pdf.v .return pdf.assign(v=(v - v.mean()) / v.std()) >>> df.groupby(\"id\").apply(normalize).show() # doctest: +SKIP +---+-------------------+ | id|  v| +---+-------------------+ | 1|-0.7071067811865475| | 1| 0.7071067811865475| | 2|-0.8320502943378437| | 2|-0.2773500981126146| | 2| 1.1094003924504583| +---+-------------------+ Alternatively, the user can define a function that takes two arguments. In this case, the grouping key(s) will be passed as the first argument and the data will be passed as the second argument. The grouping key(s) will be passed as a tuple of numpy data types, e.g., <i>numpy.int32</i> and <i>numpy.float64`. The data will still be passed in as a <i>pandas.DataFrame</i> containing all columns from the original Spark DataFrame. This is useful when the user does not want to hardcode grouping key(s) in the function. >>> import pandas as pd # doctest: +SKIP >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) # doctest: +SKIP >>> @pandas_udf(\"id long, v double\", PandasUDFType.GROUPED_MAP) # doctest: +SKIP .def mean_udf(key, pdf): .# key is a tuple of one numpy.int64, which is the value .# of 'id' for the current group .return pd.DataFrame([key + (pdf.v.mean(),)]) >>> df.groupby('id').apply(mean_udf).show() # doctest: +SKIP +---+---+ | id| v| +---+---+ | 1|1.5| | 2|6.0| +---+---+ >>> @pandas_udf( .\"id long, <i>ceil(v / 2)</i> long, v double\", .PandasUDFType.GROUPED_MAP) # doctest: +SKIP >>> def sum_udf(key, pdf): .# key is a tuple of two numpy.int64s, which is the values .# of 'id' and 'ceil(df.v / 2)' for the current group .return pd.DataFrame([key + (pdf.v.sum(),)]) >>> df.groupby(df.id, ceil(df.v / 2)).apply(sum_udf).show() # doctest: +SKIP +---+-----------+----+ | id|ceil(v / 2)| v| +---+-----------+----+ | 2| 5|10.0| | 1| 1| 3.0| | 2| 3| 5.0| | 2| 2| 3.0| +---+-----------+----+ .. note:: If returning a new <i>pandas.DataFrame</i> constructed with a dictionary, it is recommended to explicitly index the columns by name to ensure the positions are correct, or alternatively use an <i>OrderedDict`. For example, <i>pd.DataFrame({'id': ids, 'a': data}, columns=['id', 'a'])</i> or <i>pd.DataFrame(OrderedDict([('id', ids), ('a', data)]))`. .. seealso:: :meth:`pyspark.sql.GroupedData.apply</i> 3. GROUPED_AGG A grouped aggregate UDF defines a transformation: One or more <i>pandas.Series</i> -> A scalar The <i>returnType</i> should be a primitive data type, e.g., :class:`DoubleType`. The returned scalar can be either a python primitive type, e.g., <i>int</i> or <i>float</i> or a numpy data type, e.g., <i>numpy.int64</i> or <i>numpy.float64`. :class:`MapType</i> and :class:`StructType</i> are currently not supported as output types. Group aggregate UDFs are used with :meth:`pyspark.sql.GroupedData.agg</i> and :class:`pyspark.sql.Window</i> This example shows using grouped aggregated UDFs with groupby: >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) >>> @pandas_udf(\"double\", PandasUDFType.GROUPED_AGG) # doctest: +SKIP .def mean_udf(v): .return v.mean() >>> df.groupby(\"id\").agg(mean_udf(df['v'])).show() # doctest: +SKIP +---+-----------+ | id|mean_udf(v)| +---+-----------+ | 1| 1.5| | 2| 6.0| +---+-----------+ This example shows using grouped aggregated UDFs as window functions. Note that only unbounded window frame is supported at the moment: >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> from pyspark.sql import Window >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) >>> @pandas_udf(\"double\", PandasUDFType.GROUPED_AGG) # doctest: +SKIP .def mean_udf(v): .return v.mean() >>> w = Window \\ ..partitionBy('id') \\ ..rowsBetween(Window.unboundedPreceding, Window.unboundedFollowing) >>> df.withColumn('mean_v', mean_udf(df['v']).over(w)).show() # doctest: +SKIP +---+----+------+ | id| v|mean_v| +---+----+------+ | 1| 1.0| 1.5| | 1| 2.0| 1.5| | 2| 3.0| 6.0| | 2| 5.0| 6.0| | 2|10.0| 6.0| +---+----+------+ .. seealso:: :meth:`pyspark.sql.GroupedData.agg</i> and :class:`pyspark.sql.Window</i> .. note:: The user-defined functions are considered deterministic by default. Due to optimization, duplicate invocations may be eliminated or the function may even be invoked more times than it is present in the query. If your function is not deterministic, call <i>asNondeterministic</i> on the user defined function. E.g.: >>> @pandas_udf('double', PandasUDFType.SCALAR) # doctest: +SKIP .def random(v): .import numpy as np .import pandas as pd .return pd.Series(np.random.randn(len(v)) >>> random = random.asNondeterministic() # doctest: +SKIP .. note:: The user-defined functions do not support conditional expressions or short circuiting in boolean expressions and it ends up with being executed all internally. If the functions can fail on special rows, the workaround is to incorporate the condition into the functions. .. note:: The user-defined functions do not take keyword arguments on the calling side. .. versionadded:: 2.3",
            posexplode:
                '<i>posexplode(x)</i>: Returns a new row for each element with position in the given array or map. >>> from pyspark.sql import Row >>> eDF = spark.createDataFrame([Row(a=1, intlist=[1,2,3], mapfield={"a": "b"})]) >>> eDF.select(posexplode(eDF.intlist)).collect() [Row(pos=0, col=1), Row(pos=1, col=2), Row(pos=2, col=3)] >>> eDF.select(posexplode(eDF.mapfield)).show() +---+---+-----+ |pos|key|value| +---+---+-----+ | 0| a| b| +---+---+-----+ .. versionadded:: 2.1',
            posexplode_outer:
                '<i>posexplode_outer(x)</i>: Returns a new row for each element with position in the given array or map. Unlike posexplode, if the array/map is null or empty then the row (null, null) is produced. >>> df = spark.createDataFrame( .[(1, ["foo", "bar"], {"x": 1.0}), (2, [], {}), (3, None, None)], .("id", "an_array", "a_map") .) >>> df.select("id", "an_array", posexplode_outer("a_map")).show() +---+----------+----+----+-----+ | id| an_array| pos| key|value| +---+----------+----+----+-----+ | 1|[foo, bar]| 0| x| 1.0| | 2| []|null|null| null| | 3| null|null|null| null| +---+----------+----+----+-----+ >>> df.select("id", "a_map", posexplode_outer("an_array")).show() +---+----------+----+----+ | id| a_map| pos| col| +---+----------+----+----+ | 1|[x -> 1.0]| 0| foo| | 1|[x -> 1.0]| 1| bar| | 2| []|null|null| | 3| null|null|null| +---+----------+----+----+ .. versionadded:: 2.3',
            pow: '<b>pow(x,y)</b> Retorna o valor de <em>x</em> elevado a <em>y</em>',
            quarter:
                "<i>quarter(date)</i>: Extract the quarter of a given date as integer. ",
            radians:
                '<i>radians(col)</i>: Converts an angle measured in degrees to an approximately equivalent angle measured in radians. Returns the angle in radians, as if computed by <i>java.lang.Math.toRadians()</i>',
            rand:
                '<i>rand([seed])</i>: Generates a random column with independent and identically distributed (i.i.d.) samples from U[0.0, 1.0]. The function is non-deterministic in general case.',
            randn:
                "<i>randn(x)</i>: Generates a column with independent and identically distributed (i.i.d.) samples from the standard normal distribution. The function is non-deterministic in general case.",
            regexp_extract:
                "<i>regexp_extract(x)</i>: Extract a specific group matched by a Java regex, from the specified string column. If the regex did not match, or the specified group did not match, an empty string is returned. >>> df = spark.createDataFrame([('100-200',)], ['str']) >>> df.select(regexp_extract('str', r'(\\d+)-(\\d+)', 1).alias('d')).collect() [Row(d='100')] >>> df = spark.createDataFrame([('foo',)], ['str']) >>> df.select(regexp_extract('str', r'(\\d+)', 1).alias('d')).collect() [Row(d='')] >>> df = spark.createDataFrame([('aaaac',)], ['str']) >>> df.select(regexp_extract('str', '(a+)(b)?(c)', 2).alias('d')).collect() [Row(d='')] .. ",
            regexp_replace:
                "<i>regexp_replace(x)</i>: Replace all substrings of the specified string value that match regexp with rep. >>> df = spark.createDataFrame([('100-200',)], ['str']) >>> df.select(regexp_replace('str', r'(\\d+)', '--').alias('d')).collect() [Row(d='-----')] .. ",
            repeat:
                "<i>repeat(x)</i>: Repeats a string column n times, and returns it as a new string column. >>> df = spark.createDataFrame([('ab',)], ['s',]) >>> df.select(repeat(df.s, 3).alias('s')).collect() [Row(s='ababab')] .. ",
            reverse:
                "<i>reverse(x)</i>: Returns a reversed string or an array with reverse order of elements. :param col: name of column or expression >>> df = spark.createDataFrame([('Spark SQL',)], ['data']) >>> df.select(reverse(df.data).alias('s')).collect() [Row(s='LQS krapS')] >>> df = spark.createDataFrame([([2, 1, 3],) ,([1],) ,([],)], ['data']) >>> df.select(reverse(df.data).alias('r')).collect() [Row(r=[3, 1, 2]), Row(r=[1]), Row(r=[])] .. ",
            rint:
                '<i>rint(x)</i>: Returns the double value that is closest in value to the argument and is equal to a mathematical integer.',
            round:
                "<i>round(value, scale)</i>: Round the given <i>value</i> to <i>scale</i> decimal places using HALF_UP rounding mode if <i>scale</i> >= 0 or at integral part when <i>scale</i> < 0.",
            rpad:
                "<i>rpad(x)</i>: Right-pad the string column to width <i>len</i> with <i>pad`. >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(rpad(df.s, 6, '#').alias('s')).collect() [Row(s='abcd##')] .. ",
            rtrim:
                '<i>rtrim(x)</i>: Trim the spaces from right end for the specified string value.',
            schema_of_json:
                '<i>schema_of_json(x)</i>: Parses a JSON string and infers its schema in DDL format. :param json: a JSON string or a string literal containing a JSON string. >>> df = spark.range(1) >>> df.select(schema_of_json(\'{"a": 0}\').alias("json")).collect() [Row(json=\'struct<a:bigint>\')] .. ',
            second:
                "<i>second(date)</i>: Extract the seconds of a given <i>date</i> as integer. ",
            sequence:
                "<i>sequence(start, stop, [step])</i>: Generate a sequence of integers from <i>start</i> to <i>stop</i>, incrementing by <i>step</i>. If <i>step</i> is not set, incrementing by 1 if <i>start</i> is less than or equal to <i>stop</i>, otherwise -1.",
            sha1:
                "<i>sha1(x)</i>: Returns the hex string result of SHA-1. >>> spark.createDataFrame([('ABC',)], ['a']).select(sha1('a').alias('hash')).collect() [Row(hash='3c01bdbb26f358bab27f267924aa2c9a03fcfdb8')] .. ",
            sha2:
                "<i>sha2(x)</i>: Returns the hex string result of SHA-2 family of hash functions (SHA-224, SHA-256, SHA-384, and SHA-512). The numBits indicates the desired bit length of the result, which must have a value of 224, 256, 384, 512, or 0 (which is equivalent to 256). >>> digests = df.select(sha2(df.name, 256).alias('s')).collect() >>> digests[0] Row(s='3bc51062973c458d5a6f2d8d64a023246354ad7e064b1e4e009ec8a0699a3043') >>> digests[1] Row(s='cd9fb1e148ccd8442e5aa74904cc73bf6fb54d1d54d333bd596aa9bb4bb4e961') .. ",
            shiftLeft:
                "<i>shiftLeft(value, numBits)</i>: Shift the given <i>value</i> <i>numBits</i> left.",
            shiftRight:
                "<i>shiftRight(x)</i>: (Signed) shift the given <i>value</i> <i>numBits</i> right.",
            shiftRightUnsigned:
                "<i>shiftRightUnsigned(x)</i>: (Unsigned) shift the given <i>value</i> <i>numBits</i> right.",
            shuffle:
                "<i>shuffle(x)</i>: Generates a random permutation of the given array. .. note:: The function is non-deterministic. :param col: name of column or expression >>> df = spark.createDataFrame([([1, 20, 3, 5],), ([1, 20, None, 3],)], ['data']) >>> df.select(shuffle(df.data).alias('s')).collect() # doctest: +SKIP [Row(s=[3, 1, 5, 20]), Row(s=[20, None, 3, 1])] .. ",
            signum: '<i>signum(x)</i>: Computes the signum of the given value.',
            sin:
                '<i>sin(x)</i>: Returns the sine of the angle (in radians), as if computed by <i>java.lang.Math.sin()</i>.',
            // since:
            //   '<i>since(x)</i>: A decorator that annotates a function to append the version of Spark the function was added. ',
            sinh:
                '<i>sinh(x)</i>: Returns the hyperbolic sine of the given value, as if computed by <i>java.lang.Math.sinh()</i>.',
            size:
                "<i>size(x)</i>: Returns the length of the array or map stored in the column. :param col: name of column or expression >>> df = spark.createDataFrame([([1, 2, 3],),([1],),([],)], ['data']) >>> df.select(size(df.data)).collect() [Row(size(data)=3), Row(size(data)=1), Row(size(data)=0)] .. ",
            slice:
                '<i>slice(x)</i>: Returns an array containing all the elements in <i>x</i> from index <i>start</i> (array indices start at 1, or from the end if <i>start</i> is negative) with the specified <i>length`. :param x: the array to be sliced :param start: the starting index :param length: the length of the slice >>> df = spark.createDataFrame([([1, 2, 3],), ([4, 5],)], [\'x\']) >>> df.select(slice(df.x, 2, 2).alias("sliced")).collect() [Row(sliced=[2, 3]), Row(sliced=[5])] .. ',
            sort_array:
                '<i>sort_array(array)</i>: sorts the input <i>array</i> in ascending or descending order according to the natural ordering of the array elements. Null elements will be placed at the beginning of the returned array in ascending order or at the end of the returned array in descending order.',
            soundex:
                '<i>soundex(str)</i>: Returns the SoundEx encoding for a string.',
            //  "spark_partition_id": "<i>spark_partition_id(x)</i>: A column for partition ID. .. note:: This is indeterministic because it depends on data partitioning and task scheduling. >>> df.repartition(1).select(spark_partition_id().alias(\"pid\")).collect() [Row(pid=0), Row(pid=0)] .. ",
            split:
                '<i>split(str, pattern)</i>: Splits <i>str</i> around <i>pattern</i> (<i>pattern</i> is a string representing a regular expression).',
            sqrt:
                '<i>sqrt(x)</i>: Computes the square root of the specified float value.',
            struct:
                "<i>struct(x)</i>: Creates a new struct column. :param cols: list of column names (string) or list of :class:`Column</i> expressions >>> df.select(struct('age', 'name').alias(\"struct\")).collect() [Row(struct=Row(age=2, name='Alice')), Row(struct=Row(age=5, name='Bob'))] >>> df.select(struct([df.age, df.name]).alias(\"struct\")).collect() [Row(struct=Row(age=2, name='Alice')), Row(struct=Row(age=5, name='Bob'))] .. ",
            substring:
                '<i>substring(x, pos, len)</i>: Substring starts at <i>pos</i> and is of length <i>len</i> when str is String type or returns the slice of byte array that starts at <i>pos</i> in byte and is of length <i>len</i> when str is Binary type.',
            substring_index:
                "<i>substring_index(x)</i>: Returns the substring from string str before count occurrences of the delimiter delim. If count is positive, everything the left of the final delimiter (counting from left) is returned. If count is negative, every to the right of the final delimiter (counting from the right) is returned. substring_index performs a case-sensitive match when searching for delim. >>> df = spark.createDataFrame([('a.b.c.d',)], ['s']) >>> df.select(substring_index(df.s, '.', 2).alias('s')).collect() [Row(s='a.b')] >>> df.select(substring_index(df.s, '.', -3).alias('s')).collect() [Row(s='b.c.d')] .. ",
            // "sys": "<i>sys(x)</i>: This module provides access to some objects used or maintained by theinterpreter and to functions that interact strongly with the interpreter.Dynamic objects:argv -- command line arguments; argv[0] is the script pathname if knownpath -- module search path; path[0] is the script directory, else ''modules -- dictionary of loaded modulesdisplayhook -- called to show results in an interactive sessionexcepthook -- called to handle any uncaught exception other than SystemExit To customize printing in an interactive session or to install a custom top-level exception handler, assign other functions to replace these.stdin -- standard input file object; used by input()stdout -- standard output file object; used by print()stderr -- standard error object; used for error messages By assigning other file objects (or objects that behave like files) to these, it is possible to redirect all of the interpreter's I/O.last_type -- type of last uncaught exceptionlast_value -- value of last uncaught exceptionlast_traceback -- traceback of last uncaught exception These three are only available in an interactive session after a traceback has been printed.Static objects:builtin_module_names -- tuple of module names built into this interpretercopyright -- copyright notice pertaining to this interpreterexec_prefix -- prefix used to find the machine-specific Python libraryexecutable -- absolute path of the executable binary of the Python interpreterfloat_info -- a named tuple with information about the float implementation.float_repr_style -- string indicating the style of repr() output for floatshash_info -- a named tuple with information about the hash algorithm.hexversion -- version information encoded as a single integerimplementation -- Python implementation information.int_info -- a named tuple with information about the int implementation.maxsize -- the largest supported length of containers.maxunicode -- the value of the largest Unicode code pointplatform -- platform identifierprefix -- prefix used to find the Python librarythread_info -- a named tuple with information about the thread implementation.version -- the version of this interpreter as a stringversion_info -- version information as a named tuple__stdin__ -- the original stdin; don't touch!__stdout__ -- the original stdout; don't touch!__stderr__ -- the original stderr; don't touch!__displayhook__ -- the original displayhook; don't touch!__excepthook__ -- the original excepthook; don't touch!Functions:displayhook() -- print an object to the screen, and save it in builtins._excepthook() -- print an exception and its traceback to sys.stderrexc_info() -- return thread-safe information about the current exceptionexit() -- exit the interpreter by raising SystemExitgetdlopenflags() -- returns flags to be used for dlopen() callsgetprofile() -- get the global profiling functiongetrefcount() -- return the reference count for an object (plus one :-)getrecursionlimit() -- return the max recursion depth for the interpretergetsizeof() -- return the size of an object in bytesgettrace() -- get the global debug tracing functionsetcheckinterval() -- control how often the interpreter checks for eventssetdlopenflags() -- set the flags to be used for dlopen() callssetprofile() -- set the global profiling functionsetrecursionlimit() -- set the max recursion depth for the interpretersettrace() -- set the global debug tracing function",
            tan: '<i>tan(x)</i>: Returns tangent of the given value.',
            tanh: '<i>tanh(x)</i>: Returns hyperbolic tangent of the given value.',
            // "toDegrees": "<i>toDegrees(x)</i>: .. note:: Deprecated in 2.1, use :func:`degrees</i> instead.",
            // "toRadians": "<i>toRadians(x)</i>: .. note:: Deprecated in 2.1, use :func:`radians</i> instead.",
            to_date:
                "<i>to_date(str, fmt)</i>: Converts a string to <i>DateType</i> using the optionally specified format (see <a href='http://docs.oracle.com/javase/tutorial/i18n/format/simpleDateFormat.html'>docs</a>.",
            to_json:
                '<i>to_json(attr)</i>: Converts a column containing a :class:`StructType</i>, :class:`ArrayType</i> or a :class:`MapType</i> into a JSON string. Throws an exception, in the case of an unsupported type.',
            to_timestamp:
                "<i>to_timestamp(str, fmt)</i>: Converts a <i>Column</i> into a timestamp value, using the optionally specified format (see <a href='http://docs.oracle.com/javase/tutorial/i18n/format/simpleDateFormat.html'>docs</a>).",
            to_utc_timestamp:
                '<i>to_utc_timestamp(tst)</i>: This function takes a timestamp which is timezone-agnostic, and interprets it as a timestamp in the given timezone, and renders that timestamp as a timestamp in UTC.',
            translate:
                '<i>translate(attr, matching, replace)</i>: A function translate any character in the <i>attr</i> by a character in <i>matching`. The characters in <i>replace</i> is corresponding to the characters in <i>matching`. The translate will happen when any character in the string matching with the character in the <i>matching`.',
            trim:
                '<i>trim(str)</i>: Trim the spaces from both ends for the specified string column.',
            trunc:
                "<i>trunc(date, format)</i>: Returns <i>date</i> truncated to the unit specified by the <i>format</i>. Valid formats: 'year', 'yyyy', 'yy' or 'month', 'mon', 'mm'",
            // "udf": "<i>udf(x)</i>: Creates a user defined function (UDF). .. note:: The user-defined functions are considered deterministic by default. Due to optimization, duplicate invocations may be eliminated or the function may even be invoked more times than it is present in the query. If your function is not deterministic, call <i>asNondeterministic</i> on the user defined function. E.g.: >>> from pyspark.sql.types import IntegerType >>> import random >>> random_udf = udf(lambda: int(random.random() * 100), IntegerType()).asNondeterministic() .. note:: The user-defined functions do not support conditional expressions or short circuiting in boolean expressions and it ends up with being executed all internally. If the functions can fail on special rows, the workaround is to incorporate the condition into the functions. .. note:: The user-defined functions do not take keyword arguments on the calling side. :param f: python function if used as a standalone function :param returnType: the return type of the user-defined function. The value can be either a :class:`pyspark.sql.types.DataType</i> object or a DDL-formatted type string. >>> from pyspark.sql.types import IntegerType >>> slen = udf(lambda s: len(s), IntegerType()) >>> @udf .def to_upper(s): .if s is not None: .return s.upper() .>>> @udf(returnType=IntegerType()) .def add_one(x): .if x is not None: .return x + 1 .>>> df = spark.createDataFrame([(1, \"John Doe\", 21)], (\"id\", \"name\", \"age\")) >>> df.select(slen(\"name\").alias(\"slen(name)\"), to_upper(\"name\"), add_one(\"age\")).show() +----------+--------------+------------+ |slen(name)|to_upper(name)|add_one(age)| +----------+--------------+------------+ | 8| JOHN DOE| 22| +----------+--------------+------------+ .. ",
            unbase64:
                '<i>unbase64(str)</i>: Decodes a BASE64 encoded string and returns it as a binary column',
            unhex:
                '<i>unhex(str)</i>: Inverse of hex. Interprets each pair of characters as a hexadecimal number and converts to the byte representation of number.',
            unix_timestamp:
                "<i>unix_timestamp(str)</i>: Convert time string with given pattern ('yyyy-MM-dd HH:mm:ss', by default) to Unix time stamp (in seconds), using the default timezone and the default locale, return null if fail.",
            upper: '<i>upper(str)</i>: Converts a string column to upper case.',
            // grouping:
            // '<i>grouping(x)</i>: Aggregate function: indicates whether a specified column in a GROUP BY list is aggregated or not, returns 1 for aggregated or 0 for not aggregated in the result set. >>> df.cube("name").agg(grouping("name"), sum("age")).orderBy("name").show() +-----+--------------+--------+ | name|grouping(name)|sum(age)| +-----+--------------+--------+ | null| 1| 7| |Alice| 0| 2| | Bob| 0| 5| +-----+--------------+--------+ .. versionadded:: 2.0',
            // grouping_id:
            //   '<i>grouping_id(x)</i>: Aggregate function: returns the level of grouping, equals to (grouping(c1) << (n-1)) + (grouping(c2) << (n-2)) + .+ grouping(cn) .. note:: The list of columns should match with grouping columns exactly, or empty (means all the grouping columns). >>> df.cube("name").agg(grouping_id(), sum("age")).orderBy("name").show() +-----+-------------+--------+ | name|grouping_id()|sum(age)| +-----+-------------+--------+ | null| 1| 7| |Alice| 0| 2| | Bob| 0| 5| +-----+-------------+--------+ .. versionadded:: 2.0',

            // first:
            //   '<i>first(x)</i>: Aggregate function: returns the first value in a group. The function by default returns the first values it sees. It will return the first non-null value it sees when ignoreNulls is set to true. If all values are null, then null is returned. .. note:: The function is non-deterministic because its results depends on order of rows which may be non-deterministic after a shuffle. .. ',
            // corr:
            // '<i>corr(x)</i>: Returns a new :class:`Column</i> for the Pearson Correlation Coefficient for <i>`col1`</i> and <i>`col2``. >>> a = range(20) >>> b = [2 * x for x in range(20)] >>> df = spark.createDataFrame(zip(a, b), ["a", "b"]) >>> df.agg(corr("a", "b").alias(\'c\')).collect() [Row(c=1.0)] .. ',
            // covar_pop:
            //   '<i>covar_pop(x)</i>: Returns a new `Column` for the population covariance of <i>col1</i> and <i>col2</i>. >>> a = [1] * 10 >>> b = [1] * 10 >>> df = spark.createDataFrame(zip(a, b), ["a", "b"]) >>> df.agg(covar_pop("a", "b").alias(\'c\')).collect() [Row(c=0.0)] .. versionadded:: 2.0',
            // covar_samp:
            //   '<i>covar_samp(x)</i>: Returns a new :class:`Column</i> for the sample covariance of <i>`col1`</i> and <i>`col2``. >>> a = [1] * 10 >>> b = [1] * 10 >>> df = spark.createDataFrame(zip(a, b), ["a", "b"]) >>> df.agg(covar_samp("a", "b").alias(\'c\')).collect() [Row(c=0.0)] .. versionadded:: 2.0',

            // count:
            //   '<i>count(x)</i>: Aggregate function: returns the number of items in a group.',
            // countDistinct:
            //   '<i>countDistinct(x)</i>: Returns a new :class:`Column</i> for distinct count of <i>`col`</i> or <i>`cols``. >>> df.agg(countDistinct(df.age, df.name).alias(\'c\')).collect() [Row(c=2)] >>> df.agg(countDistinct("age", "name").alias(\'c\')).collect() [Row(c=2)] .. ',
            // avg:
            //   '<i>avg(x)</i>: Aggregate function: returns the average of the values in a group.',
            //  "skewness": "<i>skewness(x)</i>: Aggregate function: returns the skewness of the values in a group.",
            //  "stddev": "<i>stddev(x)</i>: Aggregate function: alias for stddev_samp.",
            //  "stddev_pop": "<i>stddev_pop(x)</i>: Aggregate function: returns population standard deviation of the expression in a group.",
            //  "stddev_samp": "<i>stddev_samp(x)</i>: Aggregate function: returns the unbiased sample standard deviation of the expression in a group.",
            //  "sum": "<i>sum(x)</i>: Aggregate function: returns the sum of all values in the expression.",
            //  "sumDistinct": "<i>sumDistinct(x)</i>: Aggregate function: returns the sum of distinct values in the expression.",
            //  "var_pop": "<i>var_pop(x)</i>: Aggregate function: returns the population variance of the values in a group.",
            //  "var_samp": "<i>var_samp(x)</i>: Aggregate function: returns the unbiased sample variance of the values in a group.",
            //  "variance": "<i>variance(x)</i>: Aggregate function: alias for var_samp.",
            // collect_list:
            //   "<i>collect_list(x)</i>: Aggregate function: returns a list of objects with duplicates. .. note:: The function is non-deterministic because the order of collected results depends on order of rows which may be non-deterministic after a shuffle. >>> df2 = spark.createDataFrame([(2,), (5,), (5,)], ('age',)) >>> df2.agg(collect_list('age')).collect() [Row(collect_list(age)=[2, 5, 5])] .. ",
            // collect_set:
            //   "<i>collect_set(x)</i>: Aggregate function: returns a set of objects with duplicate elements eliminated. .. note:: The function is non-deterministic because the order of collected results depends on order of rows which may be non-deterministic after a shuffle. >>> df2 = spark.createDataFrame([(2,), (5,), (5,)], ('age',)) >>> df2.agg(collect_set('age')).collect() [Row(collect_set(age)=[5, 2])] .. ",
            // "warnings": "<i>warnings(x)</i>: Python part of the warnings subsystem.",
            // kurtosis:
            //   '<i>kurtosis(x)</i>: Aggregate function: returns the kurtosis of the values in a group.',
            // lag:
            //   '<i>lag(x)</i>: Window function: returns the value that is <i>offset</i> rows before the current row, and <i>defaultValue</i> if there is less than <i>offset</i> rows before the current row. For example, an <i>offset</i> of one will return the previous row at any given point in the window partition. This is equivalent to the LAG function in SQL. :param col: name of column or expression :param count: number of row to extend :param default: default value .. ',
            // last:
            //   '<i>last(x)</i>: Aggregate function: returns the last value in a group. The function by default returns the last values it sees. It will return the last non-null value it sees when ignoreNulls is set to true. If all values are null, then null is returned. .. note:: The function is non-deterministic because its results depends on order of rows which may be non-deterministic after a shuffle. .. ',
            // max:
            //   '<i>max(x)</i>: Aggregate function: returns the maximum value of the expression in a group.',
            // mean:
            //   '<i>mean(x)</i>: Aggregate function: returns the average of the values in a group.',
            // min:
            //   '<i>min(x)</i>: Aggregate function: returns the minimum value of the expression in a group.',
            //     percent_rank:
            //     '<i>percent_rank(x)</i>: Window function: returns the relative rank (i.e. percentile) of rows within a window partition.',
            //   rank:
            //     '<i>rank(x)</i>: Window function: returns the rank of rows within a window partition. The difference between rank and dense_rank is that dense_rank leaves no gaps in ranking sequence when there are ties. That is, if you were ranking a competition using dense_rank and had three people tie for second place, you would say that all three were in second place and that the next person came in third. Rank would give me sequential numbers, making the person that came in third place (after the ties) would register as coming in fifth. This is equivalent to the RANK function in SQL. .. ',

            //   row_number:
            //     '<i>row_number(x)</i>: Window function: returns a sequential number starting at 1 within a window partition.',

            weekofyear:
                '<i>weekofyear(date)</i>: Extract the week number of a given date as integer.',
            // "when": "<i>when(x)</i>: Evaluates a list of conditions and returns one of multiple possible result expressions. If :func:`Column.otherwise</i> is not invoked, None is returned for unmatched conditions. :param condition: a boolean :class:`Column</i> expression. :param value: a literal value, or a :class:`Column</i> expression. >>> df.select(when(df['age'] == 2, 3).otherwise(4).alias(\"age\")).collect() [Row(age=3), Row(age=4)] >>> df.select(when(df.age == 2, df.age + 1).alias(\"age\")).collect() [Row(age=3), Row(age=None)] .. ",
            // "window": "<i>window(x)</i>: Bucketize rows into one or more time windows given a timestamp specifying column. Window starts are inclusive but the window ends are exclusive, e.g. 12:05 will be in the window [12:05,12:10) but not in [12:00,12:05). Windows can support microsecond precision. Windows in the order of months are not supported. The time column must be of :class:`pyspark.sql.types.TimestampType`. Durations are provided as strings, e.g. '1 second', '1 day 12 hours', '2 minutes'. Valid interval strings are 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond'. If the <i>`slideDuration`</i> is not provided, the windows will be tumbling windows. The startTime is the offset with respect to 1970-01-01 00:00:00 UTC with which to start window intervals. For example, in order to have hourly tumbling windows that start 15 minutes past the hour, e.g. 12:15-13:15, 13:15-14:15.provide <i>startTime</i> as <i>15 minutes`. The output column will be a struct called 'window' by default with the nested columns 'start' and 'end', where 'start' and 'end' will be of :class:`pyspark.sql.types.TimestampType`. >>> df = spark.createDataFrame([(\"2016-03-11 09:00:07\", 1)]).toDF(\"date\", \"val\") >>> w = df.groupBy(window(\"date\", \"5 seconds\")).agg(sum(\"val\").alias(\"sum\")) >>> w.select(w.window.start.cast(\"string\").alias(\"start\"), .w.window.end.cast(\"string\").alias(\"end\"), \"sum\").collect() [Row(start='2016-03-11 09:00:05', end='2016-03-11 09:00:10', sum=1)] .. versionadded:: 2.0",
            // cume_dist:
            //   '<i>cume_dist(x)</i>: Window function: returns the cumulative distribution of values within a window partition, i.e. the fraction of rows that are below the current row. .. ',
            // dense_rank:
            //   '<i>dense_rank(x)</i>: Window function: returns the rank of rows within a window partition, without any gaps. The difference between rank and dense_rank is that dense_rank leaves no gaps in ranking sequence when there are ties. That is, if you were ranking a competition using dense_rank and had three people tie for second place, you would say that all three were in second place and that the next person came in third. Rank would give me sequential numbers, making the person that came in third place (after the ties) would register as coming in fifth. This is equivalent to the DENSE_RANK function in SQL. .. ',
            // ntile:
            //   '<i>ntile(x)</i>: Window function: returns the ntile group id (from 1 to <i>n</i> inclusive) in an ordered window partition. For example, if <i>n</i> is 4, the first quarter of the rows will get value 1, the second quarter will get 2, the third quarter will get 3, and the last quarter will get 4. This is equivalent to the NTILE function in SQL. :param n: an integer .. ',
            year: '<i>year(date)</i>: Extract the year of a given date as integer. '
        },
        operators: {
            'Lógicos': {
                '&&': 'Condição E (AND)',
                '||': 'Condição OU (OR)',
                '!': 'Condição NÃO (NOT)',
            },
            'Matemáticos': {
                '+': 'Adição',
                '-': 'Subtração',
                '*': 'Multiplicação',
                '/': 'Divisão',
            },
            'Relacionais': {
                '>': 'Maior que',
                '<': 'Menor que',
                '>=': 'Maior ou igual',
                '<=': 'Menor ou igual',
                '==': 'Igual (note, 2 sinais de igualdade!)',
                '!=': 'Diferente',
            }

        },
        tree: {
            functions: [
                {
                    key: 'math',
                    name: 'Matemáticas',
                    children: [
                        'abs',
                        'acos',
                        'asin',
                        'atan',
                        'atan2',
                        'bround',
                        'cbrt',
                        'ceil',
                        'cos',
                        'cosh',
                        'crc32',
                        'degrees',
                        'exp',
                        'expm1',
                        'floor',
                        'hypot',
                        'log',
                        'log10',
                        'log1p',
                        'log2',
                        'pow',
                        'radians',
                        'rand',
                        'randn',
                        'rint',
                        'round',
                        'sequence',
                        'sin',
                        'sinh',
                        'sqrt',
                        'tan',
                        'tanh'
                    ]
                },
                {
                    key: 'util',
                    name: 'Utilitárias',
                    children: [
                        'coalesce',
                        'create_map',
                        'from_json',
                        'get_json_object',
                        'greatest',
                        'hash',
                        'json_tuple',
                        'least',
                        'lit',
                        'md5',
                        'monotonically_increasing_id',
                        'nanvl',
                        'schema_of_json',
                        'sha1',
                        'sha2',
                        'shuffle',
                        'signum',
                        'to_json'
                    ]
                },
                {
                    key: 'bit',
                    name: 'Bit',
                    children: [
                        'bitwiseNOT',
                        'shiftLeft',
                        'shiftRight',
                        'shiftRightUnsigned'
                    ]
                },
                {
                    key: 'logic',
                    name: 'Lógicas/condicionais',
                    children: ['isnan', 'isnull']
                },
                {
                    key: 'vector',
                    name: 'Vetores',
                    children: [
                        'array_contains',
                        'array_distinct',
                        'array_except',
                        'array_intersect',
                        'array_join',
                        'array_max',
                        'array_min',
                        'array_position',
                        'array_remove',
                        'array_repeat',
                        'array_sort',
                        'array_union',
                        'arrays_overlap',
                        'arrays_zip',
                        'element_at',
                        'explode',
                        'explode_outer',
                        'flatten',
                        'map_concat',
                        'map_from_arrays',
                        'map_keys',
                        'map_values',
                        'posexplode',
                        'reverse',
                        'sequence',
                        'shuffle',
                        'size',
                        'slice',
                        'sort_array',
                        'struct'
                    ]
                },
                {
                    key: 'date',
                    name: 'Para data e hora',
                    children: [
                        'add_months',
                        'current_date',
                        'current_timestamp',
                        'date_add',
                        'date_format',
                        'date_sub',
                        'date_trunc',
                        'datediff',
                        'dayofmonth',
                        'dayofweek',
                        'dayofyear',
                        'from_unixtime',
                        'from_utc_timestamp',
                        'hour',
                        'last_day',
                        'minute',
                        'month',
                        'months_between',
                        'next_day',
                        'quarter',
                        'second',
                        'to_date',
                        'to_timestamp',
                        'to_utc_timestamp',
                        'trunc',
                        'unix_timestamp'
                    ]
                },
                {
                    key: 'text',
                    name: 'Para texto (String)',
                    children: [
                        'ascii',
                        'base64',
                        'basestring',
                        'bin',
                        'concat',
                        'concat_ws',
                        'conv',
                        'decode',
                        'encode',
                        'format_number',
                        'hex',
                        'initcap',
                        'instr',
                        'length',
                        'levenshtein',
                        'locate',
                        'lower',
                        'lpad',
                        'ltrim',
                        'regexp_extract',
                        'regexp_replace',
                        'repeat',
                        'reverse',
                        'rpad',
                        'rtrim',
                        'size',
                        'soundex',
                        'split',
                        'substring',
                        'substring_index',
                        'translate',
                        'trim',
                        'unbase64',
                        'unhex',
                        'upper'
                    ]
                }
            ]
        }
    },
    en: {
        functions: {
            abs: '<i>abs(x)</i>: Computes the absolute value of <i>x</i>',
            acos: '<i>acos(x)</i>: Returns inverse cosine of <i>x</i>',
            add_months:
                '<i>add_months(date, months)</i>: Returns the date that is <i>months</i> months after <i>start</i>.',
            //  "approx_count_distinct": "<i>approx_count_distinct(attr)</i>: Aggregate function: returns a new Column for approximate distinct count of column col.",
            array:
                '<i>array(list)</i>: Creates a new array column from a list of column names (string) or list of <i>Column</i> expressions that have the same data type.',
            array_contains:
                '<i>array_contains(column, value)</i>: Returns null if the array is null, true if the array contains the given value, and false otherwise.',
            array_distinct:
                '<i>array_distinct(column)</i>: Removes duplicate values from the array. ',
            array_except:
                '<i>array_except(col1, col2)</i>: Returns an array of the elements in col1 but not in col2, without duplicates.',
            array_intersect: '<i>array_intersect(x)</i>: Returns an array of the elements in the intersection of col1 and col2, without duplicates.',
            array_join: '<i>array_join(x)</i>: Concatenates the elements of <i>column</i> using the <i>delimiter</i>. Null values are replaced with <i>null_replacement</i> if set, otherwise they are ignored.',
            array_max: '<i>array_max(x)</i>: Returns the maximum value of the array.',
            array_min: '<i>array_min(x)</i>: Returns the minimum value of the array.',
            array_position:
                '<i>array_position(col, value)</i>: Locates the position of the first occurrence of the given <i>value</i> in the given array. Returns null if either of the arguments are null.',
            array_remove:
                "<i>array_remove(col, element)</i>: Remove all elements that equal to <i>element</i> from the given array in <i>col</i>.",
            array_repeat:
                "<i>array_repeat(col, count)</i>: creates an array containing a column repeated <i>count</i> times.",
            array_sort:
                "<i>array_sort(col)</i>: sorts the input array in ascending order. The elements of the input array must be orderable. Null elements will be placed at the end of the returned array.",
            array_union:
                '<i>array_union(col1, col2)</i>: Returns an array of the elements in the union of col1 and col2, without duplicates.',
            arrays_overlap:
                '<i>arrays_overlap(col1, col2)</i>: Returns <i>true</i> if the arrays contain any common non-null element; if not, returns null if both the arrays are non-empty and any of them contains a null element; returns false otherwise. ',
            arrays_zip:
                "<i>arrays_zip(col1, col2)</i>: Returns a merged array of structs in which the N-th struct contains all N-th values of input arrays. ",
            // asc:
            //   '<i>asc(x)</i>: Returns a sort expression based on the ascending order of the given column name.',
            //  "asc_nulls_first": "<i>asc_nulls_first(x)</i>: Returns a sort expression based on the ascending order of the given column name, and null values return before non-null values.",
            //  "asc_nulls_last": "<i>asc_nulls_last(x)</i>: Returns a sort expression based on the ascending order of the given column name, and null values appear after non-null values.",
            ascii:
                '<i>ascii(str)</i>: Computes the numeric value of the first character of the string column.',
            asin: '<i>asin(col)</i>: Returns the inverse sine of <i>col</i>.',
            atan: '<i>atan(col)</i>: Returns the inverse tangent of <i>col</i>.',
            atan2:
                '<i>atan2(col1, col2)</i>: Returns the the <i>theta</i> component of the point (</>r</i>, <i>theta</i>) in polar coordinates that corresponds to the point (<i>x</i>, <i>y</i>) in Cartesian coordinates, as if computed by <i>java.lang.Math.atan2()</i>',

            base64:
                '<i>base64(col)</i>: Computes the BASE64 encoding of a binary column and returns it as a string column.',
            basestring:
                "<i>basestring(x)</i>: str(object='') -> strstr(bytes_or_buffer[, encoding[, errors]]) -> strCreate a new string object from the given object. If encoding orerrors is specified, then the object must expose a data bufferthat will be decoded using the given encoding and error handler.Otherwise, returns the result of object.__str__() (if defined)or repr(object).encoding defaults to sys.getdefaultencoding().errors defaults to 'strict'.",
            bin:
                "<i>bin(x)</i>: Returns the string representation of the binary value of the given column. >>> df.select(bin(df.age).alias('c')).collect() [Row(c='10'), Row(c='101')] .. ",
            bitwiseNOT: '<i>bitwiseNOT(x)</i>: Computes bitwise not.',
            //  "blacklist": "<i>blacklist(x)</i>: Built-in mutable sequence.If no argument is given, the constructor creates a new empty list.The argument must be an iterable if specified.",
            //  "broadcast": "<i>broadcast(x)</i>: Marks a DataFrame as small enough for use in broadcast joins.",
            bround:
                '<i>bround(x, scale)</i>: Round the given value to <i>scale</i> decimal places using HALF_EVEN rounding mode if <i>scale</i> >= 0 or at integral part when <i>scale</i> < 0.',
            cbrt: '<i>cbrt(x)</i>: Computes the cube-root of the given value.',
            ceil: '<i>ceil(x)</i>: Computes the ceiling of the given value.',
            coalesce:
                '<i>coalesce(x)</i>: <i>coalesce(v1, v2, ..., vn)</i>: Returns the first value that is not null.',
            // col:
            //   '<i>col(x)</i>: Returns a :class:`Column</i> based on the given column name.',

            // column:
            //   '<i>column(x)</i>: Returns a :class:`Column</i> based on the given column name.',
            concat:
                '<i>concat(col1, col2, ..., coln)</i>: Concatenates multiple input columns together into a single column. The function works with strings, binary and compatible array columns.',
            concat_ws:
                '<i>concat_ws(separator, value1, value2, ..., valuen)</i>: Concatenates multiple input string columns together into a single string column, using the given separator. ',
            conv:
                "<i>conv(x)</i>: Convert a number in a string column from one base to another. >>> df = spark.createDataFrame([(\"010101\",)], ['n']) >>> df.select(conv(df.n, 2, 16).alias('hex')).collect() [Row(hex='15')] .. ",
            cos:
                '<i>cos(col)</i>: Returns the cosine of the angle (in radians), as if computed by <i>java.lang.Math.cos()</i>.',
            cosh:
                '<i>cosh(col)</i>: Returns the hyperbolic cosine of the angle, as if computed by <i>java.lang.Math.cosh()</i>.',
            crc32:
                '<i>crc32(x)</i>: Calculates the cyclic redundancy check value (CRC32) of a binary column and returns the value as a bigint.',
            create_map:
                "<i>create_map(x)</i>: Creates a new map column. :param cols: list of column names (string) or list of :class:`Column</i> expressions that are grouped as key-value pairs, e.g. (key1, value1, key2, value2, ...). >>> df.select(create_map('name', 'age').alias(\"map\")).collect() [Row(map={'Alice': 2}), Row(map={'Bob': 5})] >>> df.select(create_map([df.name, df.age]).alias(\"map\")).collect() [Row(map={'Alice': 2}), Row(map={'Bob': 5})] .. versionadded:: 2.0",
            current_date:
                '<i>current_date(x)</i>: Returns the current date as a :class:`DateType</i> column. .. ',
            current_timestamp:
                '<i>current_timestamp(x)</i>: Returns the current timestamp as a <i>TimestampType</i> column.',
            date_add:
                '<i>date_add(start, days)</i>: Returns the date that is <i>days</i> days after <i>start</i>.',
            date_format:
                "<i>date_format(date, format)</i>: Converts a date/timestamp/string to a value of string in the format specified by the date format given by the second argument. A pattern could be for instance <i>dd.MM.yyyy</i> and could return a string like '18.03.1993'. All pattern letters of the Java class <i><a href='http://docs.oracle.com/javase/tutorial/i18n/format/simpleDateFormat.html'>java.text.SimpleDateFormat</a></i> can be used.",
            date_sub:
                '<i>date_sub(start, days)</i>: Returns the date that is <i>days</i> days before <i>start</i>.',
            date_trunc:
                "<i>date_trunc(date, format)</i>: Returns timestamp truncated to the unit specified by the format ('year', 'yyyy', 'yy', 'month', 'mon', 'mm', 'day', 'dd', 'hour', 'minute', 'second', 'week', 'quarter')",
            datediff:
                '<i>datediff(start, end)</i>: Returns the number of days from <i>start</i> to <i>end.',
            dayofmonth:
                "<i>dayofmonth(x)</i>: Extract the day of the month of a given date as integer.",
            dayofweek:
                "<i>dayofweek(x)</i>: Extract the day of the week of a given date as integer.",
            dayofyear:
                "<i>dayofyear(x)</i>: Extract the day of the year of a given date as integer.",
            decode:
                "<i>decode(x)</i>: Computes the first argument into a string from a binary using the provided character set (one of 'US-ASCII', 'ISO-8859-1', 'UTF-8', 'UTF-16BE', 'UTF-16LE', 'UTF-16').",
            degrees:
                '<i>degrees(x)</i>: Converts an angle measured in radians to an approximately equivalent angle measured in degrees. :param col: angle in radians Returns the angle in degrees, as if computed by <i>java.lang.Math.toDegrees()</i>.',
            // desc:
            //   '<i>desc(x)</i>: Returns a sort expression based on the descending order of the given column name.',
            // desc_nulls_first:
            //   '<i>desc_nulls_first(x)</i>: Returns a sort expression based on the descending order of the given column name, and null values appear before non-null values.',
            // desc_nulls_last:
            //   '<i>desc_nulls_last(x)</i>: Returns a sort expression based on the descending order of the given column name, and null values appear after non-null values.. ',
            element_at:
                '<i>element_at(x)</i>: Returns element of array at given index in extraction if col is array. Returns value for the given key in extraction if col is map. :param col: name of column containing array or map :param extraction: index to check for in array or key to check for in map .. note:: The position is not zero based, but 1 based index. >>> df = spark.createDataFrame([(["a", "b", "c"],), ([],)], [\'data\']) >>> df.select(element_at(df.data, 1)).collect() [Row(element_at(data, 1)=\'a\'), Row(element_at(data, 1)=None)] >>> df = spark.createDataFrame([({"a": 1.0, "b": 2.0},), ({},)], [\'data\']) >>> df.select(element_at(df.data, lit("a"))).collect() [Row(element_at(data, a)=1.0), Row(element_at(data, a)=None)] .. ',
            encode:
                "<i>encode(x)</i>: Computes the first argument into a binary from a string using the provided character set (one of 'US-ASCII', 'ISO-8859-1', 'UTF-8', 'UTF-16BE', 'UTF-16LE', 'UTF-16'). .. ",
            exp: '<i>exp(x)</i>: Computes the exponential of the given value.',
            explode:
                '<i>explode(x)</i>: Returns a new row for each element in the given array or map. >>> from pyspark.sql import Row >>> eDF = spark.createDataFrame([Row(a=1, intlist=[1,2,3], mapfield={"a": "b"})]) >>> eDF.select(explode(eDF.intlist).alias("anInt")).collect() [Row(anInt=1), Row(anInt=2), Row(anInt=3)] >>> eDF.select(explode(eDF.mapfield).alias("key", "value")).show() +---+-----+ |key|value| +---+-----+ | a| b| +---+-----+ .. ',
            explode_outer:
                '<i>explode_outer(x)</i>: Returns a new row for each element in the given array or map. Unlike explode, if the array/map is null or empty then null is produced. >>> df = spark.createDataFrame( .[(1, ["foo", "bar"], {"x": 1.0}), (2, [], {}), (3, None, None)], .("id", "an_array", "a_map") .) >>> df.select("id", "an_array", explode_outer("a_map")).show() +---+----------+----+-----+ | id| an_array| key|value| +---+----------+----+-----+ | 1|[foo, bar]| x| 1.0| | 2| []|null| null| | 3| null|null| null| +---+----------+----+-----+ >>> df.select("id", "a_map", explode_outer("an_array")).show() +---+----------+----+ | id| a_map| col| +---+----------+----+ | 1|[x -> 1.0]| foo| | 1|[x -> 1.0]| bar| | 2| []|null| | 3| null|null| +---+----------+----+ .. versionadded:: 2.3',
            expm1:
                '<i>expm1(x)</i>: Computes the exponential of the given value minus one.',
            // expr:
            //   '<i>expr(x)</i>: Parses the expression string into the column that it represents >>> df.select(expr("length(name)")).collect() [Row(length(name)=5), Row(length(name)=3)] .. ',
            factorial:
                "<i>factorial(x)</i>: Computes the factorial of the given value. >>> df = spark.createDataFrame([(5,)], ['n']) >>> df.select(factorial(df.n).alias('f')).collect() [Row(f=120)] .. ",
            flatten:
                "<i>flatten(x)</i>: creates a single array from an array of arrays. If a structure of nested arrays is deeper than two levels, only one level of nesting is removed. :param col: name of column or expression >>> df = spark.createDataFrame([([[1, 2, 3], [4, 5], [6]],), ([None, [4, 5]],)], ['data']) >>> df.select(flatten(df.data).alias('r')).collect() [Row(r=[1, 2, 3, 4, 5, 6]), Row(r=None)] .. ",
            floor: '<i>floor(x)</i>: Computes the floor of the given value.',
            format_number:
                "<i>format_number(x, decimal_places)</i>: Formats the number <i>x</i> to a format like '#,--#,--#.--', rounded to d decimal places with HALF_EVEN round mode, and returns the result as a string.",
            format_string:
                "<i>format_string(x)</i>: Formats the arguments in printf-style and returns the result as a string column. :param format: string that can contain embedded format tags and used as result column's value :param cols: list of column names (string) or list of :class:`Column</i> expressions to be used in formatting >>> df = spark.createDataFrame([(5, \"hello\")], ['a', 'b']) >>> df.select(format_string('%d %s', df.a, df.b).alias('v')).collect() [Row(v='5 hello')] .. ",
            from_json:
                '<i>from_json(x)</i>: Parses a column containing a JSON string into a :class:`MapType</i> with :class:`StringType</i> as keys type, :class:`StructType</i> or :class:`ArrayType</i> with the specified schema. Returns <i>null</i>, in the case of an unparseable string. :param col: string column in json format :param schema: a StructType or ArrayType of StructType to use when parsing the json column. :param options: options to control parsing. accepts the same options as the json datasource .. note:: Since Spark 2.3, the DDL-formatted string or a JSON format string is also supported for <i>`schema``. >>> from pyspark.sql.types import * >>> data = [(1, \'\'\'{"a": 1}\'\'\')] >>> schema = StructType([StructField("a", IntegerType())]) >>> df = spark.createDataFrame(data, ("key", "value")) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=Row(a=1))] >>> df.select(from_json(df.value, "a INT").alias("json")).collect() [Row(json=Row(a=1))] >>> df.select(from_json(df.value, "MAP<STRING,INT>").alias("json")).collect() [Row(json={\'a\': 1})] >>> data = [(1, \'\'\'[{"a": 1}]\'\'\')] >>> schema = ArrayType(StructType([StructField("a", IntegerType())])) >>> df = spark.createDataFrame(data, ("key", "value")) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=[Row(a=1)])] >>> schema = schema_of_json(lit(\'\'\'{"a": 0}\'\'\')) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=Row(a=1))] >>> data = [(1, \'\'\'[1, 2, 3]\'\'\')] >>> schema = ArrayType(IntegerType()) >>> df = spark.createDataFrame(data, ("key", "value")) >>> df.select(from_json(df.value, schema).alias("json")).collect() [Row(json=[1, 2, 3])] .. versionadded:: 2.1',
            from_unixtime:
                "<i>from_unixtime(timestamp)</i>: Converts the number of seconds from unix epoch (1970-01-01 00:00:00 UTC) to a string representing the timestamp of that moment in the current system time zone in the given format.",
            from_utc_timestamp:
                "<i>from_utc_timestamp(timestamp)</i>: This is a common function for databases supporting TIMESTAMP WITHOUT TIMEZONE. This function takes a timestamp which is timezone-agnostic, and interprets it as a timestamp in UTC, and renders that timestamp as a timestamp in the given time zone. However, timestamp in Spark represents number of microseconds from the Unix epoch, which is not timezone-agnostic. So in Spark this function just shift the timestamp value from UTC timezone to the given timezone. This function may return confusing result if the input is a string with timezone, e.g. '2018-03-13T06:18:23+00:00'. The reason is that, Spark firstly cast the string to timestamp according to the timezone in the string, and finally display the result by converting the timestamp to string according to the session local timezone.",
            //  "functools": "<i>functools(x)</i>: functools.py - Tools for working with functions and callable objects",
            get_json_object:
                "<i>get_json_object(x)</i>: Extracts json object from a json string based on json path specified, and returns json string of the extracted json object. It will return null if the input json string is invalid. :param col: string column in json format :param path: path to the json object to extract >>> data = [(\"1\", '''{\"f1\": \"value1\", \"f2\": \"value2\"}'''), (\"2\", '''{\"f1\": \"value12\"}''')] >>> df = spark.createDataFrame(data, (\"key\", \"jstring\")) >>> df.select(df.key, get_json_object(df.jstring, '$.f1').alias(\"c0\"), \\ . get_json_object(df.jstring, '$.f2').alias(\"c1\") ).collect() [Row(key='1', c0='value1', c1='value2'), Row(key='2', c0='value12', c1=None)] .. ",
            greatest:
                "<i>greatest(x)</i>: Returns the greatest value of the list of column names, skipping null values. This function takes at least 2 parameters. It will return null iff all parameters are null. >>> df = spark.createDataFrame([(1, 4, 3)], ['a', 'b', 'c']) >>> df.select(greatest(df.a, df.b, df.c).alias(\"greatest\")).collect() [Row(greatest=4)] .. ",
            hash:
                '<i>hash(cols)</i>: Calculates the hash code of given columns, and returns the result as an int column.',
            hex:
                "<i>hex(x)</i>: Computes hex value of the given column, which could be :class:`pyspark.sql.types.StringType</i>, :class:`pyspark.sql.types.BinaryType</i>, :class:`pyspark.sql.types.IntegerType</i> or :class:`pyspark.sql.types.LongType`. >>> spark.createDataFrame([('ABC', 3)], ['a', 'b']).select(hex('a'), hex('b')).collect() [Row(hex(a)='414243', hex(b)='3')] .. ",
            hour:
                "<i>hour(date)</i>: Extract the hours of a given <i>date</i> as integer.",
            hypot:
                '<i>hypot(a, b)</i>: Computes <i>sqrt(a^2 + b^2)</i> without intermediate overflow or underflow.',
            // ignore_unicode_prefix:
            //   "<i>ignore_unicode_prefix(x)</i>: Ignore the 'u' prefix of string in doc tests, to make it works in both python 2 and 3 ",
            initcap:
                "<i>initcap(x)</i>: Translate the first letter of each word to upper case in the sentence. >>> spark.createDataFrame([('ab cd',)], ['a']).select(initcap(\"a\").alias('v')).collect() [Row(v='Ab Cd')] .. ",
            // input_file_name:
            //   '<i>input_file_name(x)</i>: Creates a string column for the file name of the current Spark task. .. ',
            instr:
                "<i>instr(x)</i>: Locate the position of the first occurrence of substr column in the given string. Returns null if either of the arguments are null. .. note:: The position is not zero based, but 1 based index. Returns 0 if substr could not be found in str. >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(instr(df.s, 'b').alias('s')).collect() [Row(s=2)] .. ",
            isnan:
                '<i>isnan(column)</i>: Returns <i>true</i> iff the <i>column</i> is <i>NaN</i> (not a number). ',
            isnull:
                '<i>isnull(x)</i>: Returns <i>true</i> iff the <i>column</i> is <i>null</i>.',
            json_tuple:
                "<i>json_tuple(x)</i>: Creates a new row for a json column according to the given field names. :param col: string column in json format :param fields: list of fields to extract >>> data = [(\"1\", '''{\"f1\": \"value1\", \"f2\": \"value2\"}'''), (\"2\", '''{\"f1\": \"value12\"}''')] >>> df = spark.createDataFrame(data, (\"key\", \"jstring\")) >>> df.select(df.key, json_tuple(df.jstring, 'f1', 'f2')).collect() [Row(key='1', c0='value1', c1='value2'), Row(key='2', c0='value12', c1=None)] .. ",

            last_day:
                "<i>last_day(date)</i>: Returns the last day of the month which the given <i>date</i> belongs to.",
            // lead:
            //   '<i>lead(x)</i>: Window function: returns the value that is <i>offset</i> rows after the current row, and <i>defaultValue</i> if there is less than <i>offset</i> rows after the current row. For example, an <i>offset</i> of one will return the next row at any given point in the window partition. This is equivalent to the LEAD function in SQL. :param col: name of column or expression :param count: number of row to extend :param default: default value .. ',
            least:
                "<i>least(x)</i>: Returns the least value of the list of column names, skipping null values. This function takes at least 2 parameters. It will return null iff all parameters are null. >>> df = spark.createDataFrame([(1, 4, 3)], ['a', 'b', 'c']) >>> df.select(least(df.a, df.b, df.c).alias(\"least\")).collect() [Row(least=1)] .. ",
            length:
                "<i>length(x)</i>: Computes the character length of string data or number of bytes of binary data. The length of character data includes the trailing spaces. The length of binary data includes binary zeros. >>> spark.createDataFrame([('ABC ',)], ['a']).select(length('a').alias('length')).collect() [Row(length=4)] .. ",
            levenshtein:
                "<i>levenshtein(x)</i>: Computes the Levenshtein distance of the two given strings. >>> df0 = spark.createDataFrame([('kitten', 'sitting',)], ['l', 'r']) >>> df0.select(levenshtein('l', 'r').alias('d')).collect() [Row(d=3)] .. ",
            lit:
                "<i>lit(x)</i>: Creates a :class:`Column</i> of literal value. >>> df.select(lit(5).alias('height')).withColumn('spark_user', lit(True)).take(1) [Row(height=5, spark_user=True)] .. ",
            locate:
                "<i>locate(x)</i>: Locate the position of the first occurrence of substr in a string column, after position pos. .. note:: The position is not zero based, but 1 based index. Returns 0 if substr could not be found in str. :param substr: a string :param str: a Column of :class:`pyspark.sql.types.StringType</i> :param pos: start position (zero based) >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(locate('b', df.s, 1).alias('s')).collect() [Row(s=2)] .. ",
            log:
                "<i>log(x, y)</i>: Returns the first argument-based (<i>x</i>) logarithm of the second argument (<i>y</i>) . If there is only one argument, then this takes the natural logarithm of the argument. ",
            log10:
                '<i>log10(x)</i>: Computes the logarithm of the given value in Base 10.',
            log1p:
                '<i>log1p(x)</i>: Computes the natural logarithm of the given value plus one.',
            log2:
                "<i>log2(x)</i>: Returns the base-2 logarithm of the argument.",
            lower: '<i>lower(x)</i>: Converts a string column to lower case.',
            lpad:
                "<i>lpad(x)</i>: Left-pad the string column to width <i>len</i> with <i>pad`. >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(lpad(df.s, 6, '#').alias('s')).collect() [Row(s='##abcd')] .. ",
            ltrim:
                '<i>ltrim(x)</i>: Trim the spaces from left end for the specified string value.',
            map_concat:
                '<i>map_concat(x)</i>: Returns the union of all the given maps. :param cols: list of column names (string) or list of :class:`Column</i> expressions >>> from pyspark.sql.functions import map_concat >>> df = spark.sql("SELECT map(1, \'a\', 2, \'b\') as map1, map(3, \'c\', 1, \'d\') as map2") >>> df.select(map_concat("map1", "map2").alias("map3")).show(truncate=False) +--------------------------------+ |map3  | +--------------------------------+ |[1 -> a, 2 -> b, 3 -> c, 1 -> d]| +--------------------------------+ .. ',
            map_from_arrays:
                "<i>map_from_arrays(x)</i>: Creates a new map from two arrays. :param col1: name of column containing a set of keys. All elements should not be null :param col2: name of column containing a set of values >>> df = spark.createDataFrame([([2, 5], ['a', 'b'])], ['k', 'v']) >>> df.select(map_from_arrays(df.k, df.v).alias(\"map\")).show() +----------------+ | map| +----------------+ |[2 -> a, 5 -> b]| +----------------+ .. ",
            map_from_entries:
                '<i>map_from_entries(x)</i>: Returns a map created from the given array of entries. :param col: name of column or expression >>> from pyspark.sql.functions import map_from_entries >>> df = spark.sql("SELECT array(struct(1, \'a\'), struct(2, \'b\')) as data") >>> df.select(map_from_entries("data").alias("map")).show() +----------------+ | map| +----------------+ |[1 -> a, 2 -> b]| +----------------+ .. ',
            map_keys:
                '<i>map_keys(x)</i>: Returns an unordered array containing the keys of the map. :param col: name of column or expression >>> from pyspark.sql.functions import map_keys >>> df = spark.sql("SELECT map(1, \'a\', 2, \'b\') as data") >>> df.select(map_keys("data").alias("keys")).show() +------+ | keys| +------+ |[1, 2]| +------+ .. versionadded:: 2.3',
            map_values:
                '<i>map_values(x)</i>: Returns an unordered array containing the values of the map. :param col: name of column or expression >>> from pyspark.sql.functions import map_values >>> df = spark.sql("SELECT map(1, \'a\', 2, \'b\') as data") >>> df.select(map_values("data").alias("values")).show() +------+ |values| +------+ |[a, b]| +------+ .. versionadded:: 2.3',
            md5:
                "<i>md5(x)</i>: Calculates the MD5 digest and returns the value as a 32 character hex string. >>> spark.createDataFrame([('ABC',)], ['a']).select(md5('a').alias('hash')).collect() [Row(hash='902fbdd2b1df0c4f70b4a5d23525e932')] .. ",

            minute:
                "<i>minute(date)</i>: Extract the minutes of a given <i>date</i> as integer.",
            monotonically_increasing_id:
                "<i>monotonically_increasing_id(x)</i>: A column that generates monotonically increasing 64-bit integers. The generated ID is guaranteed to be monotonically increasing and unique, but not consecutive. The current implementation puts the partition ID in the upper 31 bits, and the record number within each partition in the lower 33 bits. The assumption is that the data frame has less than 1 billion partitions, and each partition has less than 8 billion records. .. note:: The function is non-deterministic because its result depends on partition IDs. As an example, consider a :class:`DataFrame</i> with two partitions, each with 3 records. This expression would return the following IDs: 0, 1, 2, 8589934592 (1L << 33), 8589934593, 8589934594. >>> df0 = sc.parallelize(range(2), 2).mapPartitions(lambda x: [(1,), (2,), (3,)]).toDF(['col1']) >>> df0.select(monotonically_increasing_id().alias('id')).collect() [Row(id=0), Row(id=1), Row(id=2), Row(id=8589934592), Row(id=8589934593), Row(id=8589934594)] .. ",
            month:
                "<i>month(date)</i>: Extract the month of a given <i>date</i> as integer.",
            months_between:
                "<i>months_between(date1, date2, [roundOff])</i>: Returns number of months between dates <i>date1</i> and <i>date2</i>. If <i>date1</i> is later than <i>date2</i>, then the result is positive. If <i>date1</i> and <i>date2</i> are on the same day of month, or both are the last day of month, returns an integer (time of day will be ignored). The result is rounded off to 8 digits unless <i>roundOff</i> is set to <i>0<i>. ",
            nanvl:
                '<i>nanvl(x)</i>: Returns col1 if it is not NaN, or col2 if col1 is NaN. Both inputs should be floating point columns (:class:`DoubleType</i> or :class:`FloatType`). >>> df = spark.createDataFrame([(1.0, float(\'nan\')), (float(\'nan\'), 2.0)], ("a", "b")) >>> df.select(nanvl("a", "b").alias("r1"), nanvl(df.a, df.b).alias("r2")).collect() [Row(r1=1.0, r2=1.0), Row(r1=2.0, r2=2.0)] .. ',
            next_day:
                '<i>next_day(date, dayOfWeek)</i>: Returns the first date which is later than the value of the <i>date</i> column. The <i>dayOfWeek</i> parameter is case insensitive, and accepts: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun".',

            //  "pandas_udf": "<i>pandas_udf(x)</i>: Creates a vectorized user defined function (UDF). :param f: user-defined function. A python function if used as a standalone function :param returnType: the return type of the user-defined function. The value can be either a :class:`pyspark.sql.types.DataType</i> object or a DDL-formatted type string. :param functionType: an enum value in :class:`pyspark.sql.functions.PandasUDFType`.  Default: SCALAR. .. note:: Experimental The function type of the UDF can be one of the following: 1. SCALAR A scalar UDF defines a transformation: One or more <i>pandas.Series</i> -> A <i>pandas.Series`. The length of the returned <i>pandas.Series</i> must be of the same as the input <i>pandas.Series`. :class:`MapType</i>, :class:`StructType</i> are currently not supported as output types. Scalar UDFs are used with :meth:`pyspark.sql.DataFrame.withColumn</i> and :meth:`pyspark.sql.DataFrame.select`. >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> from pyspark.sql.types import IntegerType, StringType >>> slen = pandas_udf(lambda s: s.str.len(), IntegerType()) # doctest: +SKIP >>> @pandas_udf(StringType()) # doctest: +SKIP .def to_upper(s): .return s.str.upper() .>>> @pandas_udf(\"integer\", PandasUDFType.SCALAR) # doctest: +SKIP .def add_one(x): .return x + 1 .>>> df = spark.createDataFrame([(1, \"John Doe\", 21)], . (\"id\", \"name\", \"age\")) # doctest: +SKIP >>> df.select(slen(\"name\").alias(\"slen(name)\"), to_upper(\"name\"), add_one(\"age\")) \\ ..show() # doctest: +SKIP +----------+--------------+------------+ |slen(name)|to_upper(name)|add_one(age)| +----------+--------------+------------+ | 8| JOHN DOE| 22| +----------+--------------+------------+ .. note:: The length of <i>pandas.Series</i> within a scalar UDF is not that of the whole input column, but is the length of an internal batch used for each call to the function. Therefore, this can be used, for example, to ensure the length of each returned <i>pandas.Series</i>, and can not be used as the column length. 2. GROUPED_MAP A grouped map UDF defines transformation: A <i>pandas.DataFrame</i> -> A <i>pandas.DataFrame</i> The returnType should be a :class:`StructType</i> describing the schema of the returned <i>pandas.DataFrame`. The column labels of the returned <i>pandas.DataFrame</i> must either match the field names in the defined returnType schema if specified as strings, or match the field data types by position if not strings, e.g. integer indices. The length of the returned <i>pandas.DataFrame</i> can be arbitrary. Grouped map UDFs are used with :meth:`pyspark.sql.GroupedData.apply`. >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) # doctest: +SKIP >>> @pandas_udf(\"id long, v double\", PandasUDFType.GROUPED_MAP) # doctest: +SKIP .def normalize(pdf): .v = pdf.v .return pdf.assign(v=(v - v.mean()) / v.std()) >>> df.groupby(\"id\").apply(normalize).show() # doctest: +SKIP +---+-------------------+ | id|  v| +---+-------------------+ | 1|-0.7071067811865475| | 1| 0.7071067811865475| | 2|-0.8320502943378437| | 2|-0.2773500981126146| | 2| 1.1094003924504583| +---+-------------------+ Alternatively, the user can define a function that takes two arguments. In this case, the grouping key(s) will be passed as the first argument and the data will be passed as the second argument. The grouping key(s) will be passed as a tuple of numpy data types, e.g., <i>numpy.int32</i> and <i>numpy.float64`. The data will still be passed in as a <i>pandas.DataFrame</i> containing all columns from the original Spark DataFrame. This is useful when the user does not want to hardcode grouping key(s) in the function. >>> import pandas as pd # doctest: +SKIP >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) # doctest: +SKIP >>> @pandas_udf(\"id long, v double\", PandasUDFType.GROUPED_MAP) # doctest: +SKIP .def mean_udf(key, pdf): .# key is a tuple of one numpy.int64, which is the value .# of 'id' for the current group .return pd.DataFrame([key + (pdf.v.mean(),)]) >>> df.groupby('id').apply(mean_udf).show() # doctest: +SKIP +---+---+ | id| v| +---+---+ | 1|1.5| | 2|6.0| +---+---+ >>> @pandas_udf( .\"id long, <i>ceil(v / 2)</i> long, v double\", .PandasUDFType.GROUPED_MAP) # doctest: +SKIP >>> def sum_udf(key, pdf): .# key is a tuple of two numpy.int64s, which is the values .# of 'id' and 'ceil(df.v / 2)' for the current group .return pd.DataFrame([key + (pdf.v.sum(),)]) >>> df.groupby(df.id, ceil(df.v / 2)).apply(sum_udf).show() # doctest: +SKIP +---+-----------+----+ | id|ceil(v / 2)| v| +---+-----------+----+ | 2| 5|10.0| | 1| 1| 3.0| | 2| 3| 5.0| | 2| 2| 3.0| +---+-----------+----+ .. note:: If returning a new <i>pandas.DataFrame</i> constructed with a dictionary, it is recommended to explicitly index the columns by name to ensure the positions are correct, or alternatively use an <i>OrderedDict`. For example, <i>pd.DataFrame({'id': ids, 'a': data}, columns=['id', 'a'])</i> or <i>pd.DataFrame(OrderedDict([('id', ids), ('a', data)]))`. .. seealso:: :meth:`pyspark.sql.GroupedData.apply</i> 3. GROUPED_AGG A grouped aggregate UDF defines a transformation: One or more <i>pandas.Series</i> -> A scalar The <i>returnType</i> should be a primitive data type, e.g., :class:`DoubleType`. The returned scalar can be either a python primitive type, e.g., <i>int</i> or <i>float</i> or a numpy data type, e.g., <i>numpy.int64</i> or <i>numpy.float64`. :class:`MapType</i> and :class:`StructType</i> are currently not supported as output types. Group aggregate UDFs are used with :meth:`pyspark.sql.GroupedData.agg</i> and :class:`pyspark.sql.Window</i> This example shows using grouped aggregated UDFs with groupby: >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) >>> @pandas_udf(\"double\", PandasUDFType.GROUPED_AGG) # doctest: +SKIP .def mean_udf(v): .return v.mean() >>> df.groupby(\"id\").agg(mean_udf(df['v'])).show() # doctest: +SKIP +---+-----------+ | id|mean_udf(v)| +---+-----------+ | 1| 1.5| | 2| 6.0| +---+-----------+ This example shows using grouped aggregated UDFs as window functions. Note that only unbounded window frame is supported at the moment: >>> from pyspark.sql.functions import pandas_udf, PandasUDFType >>> from pyspark.sql import Window >>> df = spark.createDataFrame( .[(1, 1.0), (1, 2.0), (2, 3.0), (2, 5.0), (2, 10.0)], .(\"id\", \"v\")) >>> @pandas_udf(\"double\", PandasUDFType.GROUPED_AGG) # doctest: +SKIP .def mean_udf(v): .return v.mean() >>> w = Window \\ ..partitionBy('id') \\ ..rowsBetween(Window.unboundedPreceding, Window.unboundedFollowing) >>> df.withColumn('mean_v', mean_udf(df['v']).over(w)).show() # doctest: +SKIP +---+----+------+ | id| v|mean_v| +---+----+------+ | 1| 1.0| 1.5| | 1| 2.0| 1.5| | 2| 3.0| 6.0| | 2| 5.0| 6.0| | 2|10.0| 6.0| +---+----+------+ .. seealso:: :meth:`pyspark.sql.GroupedData.agg</i> and :class:`pyspark.sql.Window</i> .. note:: The user-defined functions are considered deterministic by default. Due to optimization, duplicate invocations may be eliminated or the function may even be invoked more times than it is present in the query. If your function is not deterministic, call <i>asNondeterministic</i> on the user defined function. E.g.: >>> @pandas_udf('double', PandasUDFType.SCALAR) # doctest: +SKIP .def random(v): .import numpy as np .import pandas as pd .return pd.Series(np.random.randn(len(v)) >>> random = random.asNondeterministic() # doctest: +SKIP .. note:: The user-defined functions do not support conditional expressions or short circuiting in boolean expressions and it ends up with being executed all internally. If the functions can fail on special rows, the workaround is to incorporate the condition into the functions. .. note:: The user-defined functions do not take keyword arguments on the calling side. .. versionadded:: 2.3",
            posexplode:
                '<i>posexplode(x)</i>: Returns a new row for each element with position in the given array or map. >>> from pyspark.sql import Row >>> eDF = spark.createDataFrame([Row(a=1, intlist=[1,2,3], mapfield={"a": "b"})]) >>> eDF.select(posexplode(eDF.intlist)).collect() [Row(pos=0, col=1), Row(pos=1, col=2), Row(pos=2, col=3)] >>> eDF.select(posexplode(eDF.mapfield)).show() +---+---+-----+ |pos|key|value| +---+---+-----+ | 0| a| b| +---+---+-----+ .. versionadded:: 2.1',
            posexplode_outer:
                '<i>posexplode_outer(x)</i>: Returns a new row for each element with position in the given array or map. Unlike posexplode, if the array/map is null or empty then the row (null, null) is produced. >>> df = spark.createDataFrame( .[(1, ["foo", "bar"], {"x": 1.0}), (2, [], {}), (3, None, None)], .("id", "an_array", "a_map") .) >>> df.select("id", "an_array", posexplode_outer("a_map")).show() +---+----------+----+----+-----+ | id| an_array| pos| key|value| +---+----------+----+----+-----+ | 1|[foo, bar]| 0| x| 1.0| | 2| []|null|null| null| | 3| null|null|null| null| +---+----------+----+----+-----+ >>> df.select("id", "a_map", posexplode_outer("an_array")).show() +---+----------+----+----+ | id| a_map| pos| col| +---+----------+----+----+ | 1|[x -> 1.0]| 0| foo| | 1|[x -> 1.0]| 1| bar| | 2| []|null|null| | 3| null|null|null| +---+----------+----+----+ .. versionadded:: 2.3',
            pow:
                '<i>pow(x, y)</i>: Returns the value of the first argument raised to the power of the second argument.',
            quarter:
                "<i>quarter(date)</i>: Extract the quarter of a given date as integer. ",
            radians:
                '<i>radians(col)</i>: Converts an angle measured in degrees to an approximately equivalent angle measured in radians. Returns the angle in radians, as if computed by <i>java.lang.Math.toRadians()</i>',
            rand:
                '<i>rand([seed])</i>: Generates a random column with independent and identically distributed (i.i.d.) samples from U[0.0, 1.0]. The function is non-deterministic in general case.',
            randn:
                "<i>randn(x)</i>: Generates a column with independent and identically distributed (i.i.d.) samples from the standard normal distribution. The function is non-deterministic in general case.",
            regexp_extract:
                "<i>regexp_extract(x)</i>: Extract a specific group matched by a Java regex, from the specified string column. If the regex did not match, or the specified group did not match, an empty string is returned. >>> df = spark.createDataFrame([('100-200',)], ['str']) >>> df.select(regexp_extract('str', r'(\\d+)-(\\d+)', 1).alias('d')).collect() [Row(d='100')] >>> df = spark.createDataFrame([('foo',)], ['str']) >>> df.select(regexp_extract('str', r'(\\d+)', 1).alias('d')).collect() [Row(d='')] >>> df = spark.createDataFrame([('aaaac',)], ['str']) >>> df.select(regexp_extract('str', '(a+)(b)?(c)', 2).alias('d')).collect() [Row(d='')] .. ",
            regexp_replace:
                "<i>regexp_replace(x)</i>: Replace all substrings of the specified string value that match regexp with rep. >>> df = spark.createDataFrame([('100-200',)], ['str']) >>> df.select(regexp_replace('str', r'(\\d+)', '--').alias('d')).collect() [Row(d='-----')] .. ",
            repeat:
                "<i>repeat(x)</i>: Repeats a string column n times, and returns it as a new string column. >>> df = spark.createDataFrame([('ab',)], ['s',]) >>> df.select(repeat(df.s, 3).alias('s')).collect() [Row(s='ababab')] .. ",
            reverse:
                "<i>reverse(x)</i>: Returns a reversed string or an array with reverse order of elements. :param col: name of column or expression >>> df = spark.createDataFrame([('Spark SQL',)], ['data']) >>> df.select(reverse(df.data).alias('s')).collect() [Row(s='LQS krapS')] >>> df = spark.createDataFrame([([2, 1, 3],) ,([1],) ,([],)], ['data']) >>> df.select(reverse(df.data).alias('r')).collect() [Row(r=[3, 1, 2]), Row(r=[1]), Row(r=[])] .. ",
            rint:
                '<i>rint(x)</i>: Returns the double value that is closest in value to the argument and is equal to a mathematical integer.',
            round:
                "<i>round(value, scale)</i>: Round the given <i>value</i> to <i>scale</i> decimal places using HALF_UP rounding mode if <i>scale</i> >= 0 or at integral part when <i>scale</i> < 0.",
            rpad:
                "<i>rpad(x)</i>: Right-pad the string column to width <i>len</i> with <i>pad`. >>> df = spark.createDataFrame([('abcd',)], ['s',]) >>> df.select(rpad(df.s, 6, '#').alias('s')).collect() [Row(s='abcd##')] .. ",
            rtrim:
                '<i>rtrim(x)</i>: Trim the spaces from right end for the specified string value.',
            schema_of_json:
                '<i>schema_of_json(x)</i>: Parses a JSON string and infers its schema in DDL format. :param json: a JSON string or a string literal containing a JSON string. >>> df = spark.range(1) >>> df.select(schema_of_json(\'{"a": 0}\').alias("json")).collect() [Row(json=\'struct<a:bigint>\')] .. ',
            second:
                "<i>second(date)</i>: Extract the seconds of a given <i>date</i> as integer. ",
            sequence:
                "<i>sequence(start, stop, [step])</i>: Generate a sequence of integers from <i>start</i> to <i>stop</i>, incrementing by <i>step</i>. If <i>step</i> is not set, incrementing by 1 if <i>start</i> is less than or equal to <i>stop</i>, otherwise -1.",
            sha1:
                "<i>sha1(x)</i>: Returns the hex string result of SHA-1. >>> spark.createDataFrame([('ABC',)], ['a']).select(sha1('a').alias('hash')).collect() [Row(hash='3c01bdbb26f358bab27f267924aa2c9a03fcfdb8')] .. ",
            sha2:
                "<i>sha2(x)</i>: Returns the hex string result of SHA-2 family of hash functions (SHA-224, SHA-256, SHA-384, and SHA-512). The numBits indicates the desired bit length of the result, which must have a value of 224, 256, 384, 512, or 0 (which is equivalent to 256). >>> digests = df.select(sha2(df.name, 256).alias('s')).collect() >>> digests[0] Row(s='3bc51062973c458d5a6f2d8d64a023246354ad7e064b1e4e009ec8a0699a3043') >>> digests[1] Row(s='cd9fb1e148ccd8442e5aa74904cc73bf6fb54d1d54d333bd596aa9bb4bb4e961') .. ",
            shiftLeft:
                "<i>shiftLeft(value, numBits)</i>: Shift the given <i>value</i> <i>numBits</i> left.",
            shiftRight:
                "<i>shiftRight(x)</i>: (Signed) shift the given <i>value</i> <i>numBits</i> right.",
            shiftRightUnsigned:
                "<i>shiftRightUnsigned(x)</i>: (Unsigned) shift the given <i>value</i> <i>numBits</i> right.",
            shuffle:
                "<i>shuffle(x)</i>: Generates a random permutation of the given array. .. note:: The function is non-deterministic. :param col: name of column or expression >>> df = spark.createDataFrame([([1, 20, 3, 5],), ([1, 20, None, 3],)], ['data']) >>> df.select(shuffle(df.data).alias('s')).collect() # doctest: +SKIP [Row(s=[3, 1, 5, 20]), Row(s=[20, None, 3, 1])] .. ",
            signum: '<i>signum(x)</i>: Computes the signum of the given value.',
            sin:
                '<i>sin(x)</i>: Returns the sine of the angle (in radians), as if computed by <i>java.lang.Math.sin()</i>.',
            // since:
            //   '<i>since(x)</i>: A decorator that annotates a function to append the version of Spark the function was added. ',
            sinh:
                '<i>sinh(x)</i>: Returns the hyperbolic sine of the given value, as if computed by <i>java.lang.Math.sinh()</i>.',
            size:
                "<i>size(x)</i>: Returns the length of the array or map stored in the column. :param col: name of column or expression >>> df = spark.createDataFrame([([1, 2, 3],),([1],),([],)], ['data']) >>> df.select(size(df.data)).collect() [Row(size(data)=3), Row(size(data)=1), Row(size(data)=0)] .. ",
            slice:
                '<i>slice(x)</i>: Returns an array containing all the elements in <i>x</i> from index <i>start</i> (array indices start at 1, or from the end if <i>start</i> is negative) with the specified <i>length`. :param x: the array to be sliced :param start: the starting index :param length: the length of the slice >>> df = spark.createDataFrame([([1, 2, 3],), ([4, 5],)], [\'x\']) >>> df.select(slice(df.x, 2, 2).alias("sliced")).collect() [Row(sliced=[2, 3]), Row(sliced=[5])] .. ',
            sort_array:
                '<i>sort_array(array)</i>: sorts the input <i>array</i> in ascending or descending order according to the natural ordering of the array elements. Null elements will be placed at the beginning of the returned array in ascending order or at the end of the returned array in descending order.',
            soundex:
                '<i>soundex(str)</i>: Returns the SoundEx encoding for a string.',
            //  "spark_partition_id": "<i>spark_partition_id(x)</i>: A column for partition ID. .. note:: This is indeterministic because it depends on data partitioning and task scheduling. >>> df.repartition(1).select(spark_partition_id().alias(\"pid\")).collect() [Row(pid=0), Row(pid=0)] .. ",
            split:
                '<i>split(str, pattern)</i>: Splits <i>str</i> around <i>pattern</i> (<i>pattern</i> is a string representing a regular expression).',
            sqrt:
                '<i>sqrt(x)</i>: Computes the square root of the specified float value.',
            struct:
                "<i>struct(x)</i>: Creates a new struct column. :param cols: list of column names (string) or list of :class:`Column</i> expressions >>> df.select(struct('age', 'name').alias(\"struct\")).collect() [Row(struct=Row(age=2, name='Alice')), Row(struct=Row(age=5, name='Bob'))] >>> df.select(struct([df.age, df.name]).alias(\"struct\")).collect() [Row(struct=Row(age=2, name='Alice')), Row(struct=Row(age=5, name='Bob'))] .. ",
            substring:
                '<i>substring(x, pos, len)</i>: Substring starts at <i>pos</i> and is of length <i>len</i> when str is String type or returns the slice of byte array that starts at <i>pos</i> in byte and is of length <i>len</i> when str is Binary type.',
            substring_index:
                "<i>substring_index(x)</i>: Returns the substring from string str before count occurrences of the delimiter delim. If count is positive, everything the left of the final delimiter (counting from left) is returned. If count is negative, every to the right of the final delimiter (counting from the right) is returned. substring_index performs a case-sensitive match when searching for delim. >>> df = spark.createDataFrame([('a.b.c.d',)], ['s']) >>> df.select(substring_index(df.s, '.', 2).alias('s')).collect() [Row(s='a.b')] >>> df.select(substring_index(df.s, '.', -3).alias('s')).collect() [Row(s='b.c.d')] .. ",
            // "sys": "<i>sys(x)</i>: This module provides access to some objects used or maintained by theinterpreter and to functions that interact strongly with the interpreter.Dynamic objects:argv -- command line arguments; argv[0] is the script pathname if knownpath -- module search path; path[0] is the script directory, else ''modules -- dictionary of loaded modulesdisplayhook -- called to show results in an interactive sessionexcepthook -- called to handle any uncaught exception other than SystemExit To customize printing in an interactive session or to install a custom top-level exception handler, assign other functions to replace these.stdin -- standard input file object; used by input()stdout -- standard output file object; used by print()stderr -- standard error object; used for error messages By assigning other file objects (or objects that behave like files) to these, it is possible to redirect all of the interpreter's I/O.last_type -- type of last uncaught exceptionlast_value -- value of last uncaught exceptionlast_traceback -- traceback of last uncaught exception These three are only available in an interactive session after a traceback has been printed.Static objects:builtin_module_names -- tuple of module names built into this interpretercopyright -- copyright notice pertaining to this interpreterexec_prefix -- prefix used to find the machine-specific Python libraryexecutable -- absolute path of the executable binary of the Python interpreterfloat_info -- a named tuple with information about the float implementation.float_repr_style -- string indicating the style of repr() output for floatshash_info -- a named tuple with information about the hash algorithm.hexversion -- version information encoded as a single integerimplementation -- Python implementation information.int_info -- a named tuple with information about the int implementation.maxsize -- the largest supported length of containers.maxunicode -- the value of the largest Unicode code pointplatform -- platform identifierprefix -- prefix used to find the Python librarythread_info -- a named tuple with information about the thread implementation.version -- the version of this interpreter as a stringversion_info -- version information as a named tuple__stdin__ -- the original stdin; don't touch!__stdout__ -- the original stdout; don't touch!__stderr__ -- the original stderr; don't touch!__displayhook__ -- the original displayhook; don't touch!__excepthook__ -- the original excepthook; don't touch!Functions:displayhook() -- print an object to the screen, and save it in builtins._excepthook() -- print an exception and its traceback to sys.stderrexc_info() -- return thread-safe information about the current exceptionexit() -- exit the interpreter by raising SystemExitgetdlopenflags() -- returns flags to be used for dlopen() callsgetprofile() -- get the global profiling functiongetrefcount() -- return the reference count for an object (plus one :-)getrecursionlimit() -- return the max recursion depth for the interpretergetsizeof() -- return the size of an object in bytesgettrace() -- get the global debug tracing functionsetcheckinterval() -- control how often the interpreter checks for eventssetdlopenflags() -- set the flags to be used for dlopen() callssetprofile() -- set the global profiling functionsetrecursionlimit() -- set the max recursion depth for the interpretersettrace() -- set the global debug tracing function",
            tan: '<i>tan(x)</i>: Returns tangent of the given value.',
            tanh: '<i>tanh(x)</i>: Returns hyperbolic tangent of the given value.',
            // "toDegrees": "<i>toDegrees(x)</i>: .. note:: Deprecated in 2.1, use :func:`degrees</i> instead.",
            // "toRadians": "<i>toRadians(x)</i>: .. note:: Deprecated in 2.1, use :func:`radians</i> instead.",
            to_date:
                "<i>to_date(str, fmt)</i>: Converts a string to <i>DateType</i> using the optionally specified format (see <a href='http://docs.oracle.com/javase/tutorial/i18n/format/simpleDateFormat.html'>docs</a>.",
            to_json:
                '<i>to_json(attr)</i>: Converts a column containing a :class:`StructType</i>, :class:`ArrayType</i> or a :class:`MapType</i> into a JSON string. Throws an exception, in the case of an unsupported type.',
            to_timestamp:
                "<i>to_timestamp(str, fmt)</i>: Converts a <i>Column</i> into a timestamp value, using the optionally specified format (see <a href='http://docs.oracle.com/javase/tutorial/i18n/format/simpleDateFormat.html'>docs</a>).",
            to_utc_timestamp:
                '<i>to_utc_timestamp(tst)</i>: This function takes a timestamp which is timezone-agnostic, and interprets it as a timestamp in the given timezone, and renders that timestamp as a timestamp in UTC.',
            translate:
                '<i>translate(attr, matching, replace)</i>: A function translate any character in the <i>attr</i> by a character in <i>matching`. The characters in <i>replace</i> is corresponding to the characters in <i>matching`. The translate will happen when any character in the string matching with the character in the <i>matching`.',
            trim:
                '<i>trim(str)</i>: Trim the spaces from both ends for the specified string column.',
            trunc:
                "<i>trunc(date, format)</i>: Returns <i>date</i> truncated to the unit specified by the <i>format</i>. Valid formats: 'year', 'yyyy', 'yy' or 'month', 'mon', 'mm'",
            // "udf": "<i>udf(x)</i>: Creates a user defined function (UDF). .. note:: The user-defined functions are considered deterministic by default. Due to optimization, duplicate invocations may be eliminated or the function may even be invoked more times than it is present in the query. If your function is not deterministic, call <i>asNondeterministic</i> on the user defined function. E.g.: >>> from pyspark.sql.types import IntegerType >>> import random >>> random_udf = udf(lambda: int(random.random() * 100), IntegerType()).asNondeterministic() .. note:: The user-defined functions do not support conditional expressions or short circuiting in boolean expressions and it ends up with being executed all internally. If the functions can fail on special rows, the workaround is to incorporate the condition into the functions. .. note:: The user-defined functions do not take keyword arguments on the calling side. :param f: python function if used as a standalone function :param returnType: the return type of the user-defined function. The value can be either a :class:`pyspark.sql.types.DataType</i> object or a DDL-formatted type string. >>> from pyspark.sql.types import IntegerType >>> slen = udf(lambda s: len(s), IntegerType()) >>> @udf .def to_upper(s): .if s is not None: .return s.upper() .>>> @udf(returnType=IntegerType()) .def add_one(x): .if x is not None: .return x + 1 .>>> df = spark.createDataFrame([(1, \"John Doe\", 21)], (\"id\", \"name\", \"age\")) >>> df.select(slen(\"name\").alias(\"slen(name)\"), to_upper(\"name\"), add_one(\"age\")).show() +----------+--------------+------------+ |slen(name)|to_upper(name)|add_one(age)| +----------+--------------+------------+ | 8| JOHN DOE| 22| +----------+--------------+------------+ .. ",
            unbase64:
                '<i>unbase64(str)</i>: Decodes a BASE64 encoded string and returns it as a binary column',
            unhex:
                '<i>unhex(str)</i>: Inverse of hex. Interprets each pair of characters as a hexadecimal number and converts to the byte representation of number.',
            unix_timestamp:
                "<i>unix_timestamp(str)</i>: Convert time string with given pattern ('yyyy-MM-dd HH:mm:ss', by default) to Unix time stamp (in seconds), using the default timezone and the default locale, return null if fail.",
            upper: '<i>upper(str)</i>: Converts a string column to upper case.',
            // grouping:
            // '<i>grouping(x)</i>: Aggregate function: indicates whether a specified column in a GROUP BY list is aggregated or not, returns 1 for aggregated or 0 for not aggregated in the result set. >>> df.cube("name").agg(grouping("name"), sum("age")).orderBy("name").show() +-----+--------------+--------+ | name|grouping(name)|sum(age)| +-----+--------------+--------+ | null| 1| 7| |Alice| 0| 2| | Bob| 0| 5| +-----+--------------+--------+ .. versionadded:: 2.0',
            // grouping_id:
            //   '<i>grouping_id(x)</i>: Aggregate function: returns the level of grouping, equals to (grouping(c1) << (n-1)) + (grouping(c2) << (n-2)) + .+ grouping(cn) .. note:: The list of columns should match with grouping columns exactly, or empty (means all the grouping columns). >>> df.cube("name").agg(grouping_id(), sum("age")).orderBy("name").show() +-----+-------------+--------+ | name|grouping_id()|sum(age)| +-----+-------------+--------+ | null| 1| 7| |Alice| 0| 2| | Bob| 0| 5| +-----+-------------+--------+ .. versionadded:: 2.0',

            // first:
            //   '<i>first(x)</i>: Aggregate function: returns the first value in a group. The function by default returns the first values it sees. It will return the first non-null value it sees when ignoreNulls is set to true. If all values are null, then null is returned. .. note:: The function is non-deterministic because its results depends on order of rows which may be non-deterministic after a shuffle. .. ',
            // corr:
            // '<i>corr(x)</i>: Returns a new :class:`Column</i> for the Pearson Correlation Coefficient for <i>`col1`</i> and <i>`col2``. >>> a = range(20) >>> b = [2 * x for x in range(20)] >>> df = spark.createDataFrame(zip(a, b), ["a", "b"]) >>> df.agg(corr("a", "b").alias(\'c\')).collect() [Row(c=1.0)] .. ',
            // covar_pop:
            //   '<i>covar_pop(x)</i>: Returns a new `Column` for the population covariance of <i>col1</i> and <i>col2</i>. >>> a = [1] * 10 >>> b = [1] * 10 >>> df = spark.createDataFrame(zip(a, b), ["a", "b"]) >>> df.agg(covar_pop("a", "b").alias(\'c\')).collect() [Row(c=0.0)] .. versionadded:: 2.0',
            // covar_samp:
            //   '<i>covar_samp(x)</i>: Returns a new :class:`Column</i> for the sample covariance of <i>`col1`</i> and <i>`col2``. >>> a = [1] * 10 >>> b = [1] * 10 >>> df = spark.createDataFrame(zip(a, b), ["a", "b"]) >>> df.agg(covar_samp("a", "b").alias(\'c\')).collect() [Row(c=0.0)] .. versionadded:: 2.0',

            // count:
            //   '<i>count(x)</i>: Aggregate function: returns the number of items in a group.',
            // countDistinct:
            //   '<i>countDistinct(x)</i>: Returns a new :class:`Column</i> for distinct count of <i>`col`</i> or <i>`cols``. >>> df.agg(countDistinct(df.age, df.name).alias(\'c\')).collect() [Row(c=2)] >>> df.agg(countDistinct("age", "name").alias(\'c\')).collect() [Row(c=2)] .. ',
            // avg:
            //   '<i>avg(x)</i>: Aggregate function: returns the average of the values in a group.',
            //  "skewness": "<i>skewness(x)</i>: Aggregate function: returns the skewness of the values in a group.",
            //  "stddev": "<i>stddev(x)</i>: Aggregate function: alias for stddev_samp.",
            //  "stddev_pop": "<i>stddev_pop(x)</i>: Aggregate function: returns population standard deviation of the expression in a group.",
            //  "stddev_samp": "<i>stddev_samp(x)</i>: Aggregate function: returns the unbiased sample standard deviation of the expression in a group.",
            //  "sum": "<i>sum(x)</i>: Aggregate function: returns the sum of all values in the expression.",
            //  "sumDistinct": "<i>sumDistinct(x)</i>: Aggregate function: returns the sum of distinct values in the expression.",
            //  "var_pop": "<i>var_pop(x)</i>: Aggregate function: returns the population variance of the values in a group.",
            //  "var_samp": "<i>var_samp(x)</i>: Aggregate function: returns the unbiased sample variance of the values in a group.",
            //  "variance": "<i>variance(x)</i>: Aggregate function: alias for var_samp.",
            // collect_list:
            //   "<i>collect_list(x)</i>: Aggregate function: returns a list of objects with duplicates. .. note:: The function is non-deterministic because the order of collected results depends on order of rows which may be non-deterministic after a shuffle. >>> df2 = spark.createDataFrame([(2,), (5,), (5,)], ('age',)) >>> df2.agg(collect_list('age')).collect() [Row(collect_list(age)=[2, 5, 5])] .. ",
            // collect_set:
            //   "<i>collect_set(x)</i>: Aggregate function: returns a set of objects with duplicate elements eliminated. .. note:: The function is non-deterministic because the order of collected results depends on order of rows which may be non-deterministic after a shuffle. >>> df2 = spark.createDataFrame([(2,), (5,), (5,)], ('age',)) >>> df2.agg(collect_set('age')).collect() [Row(collect_set(age)=[5, 2])] .. ",
            // "warnings": "<i>warnings(x)</i>: Python part of the warnings subsystem.",
            // kurtosis:
            //   '<i>kurtosis(x)</i>: Aggregate function: returns the kurtosis of the values in a group.',
            // lag:
            //   '<i>lag(x)</i>: Window function: returns the value that is <i>offset</i> rows before the current row, and <i>defaultValue</i> if there is less than <i>offset</i> rows before the current row. For example, an <i>offset</i> of one will return the previous row at any given point in the window partition. This is equivalent to the LAG function in SQL. :param col: name of column or expression :param count: number of row to extend :param default: default value .. ',
            // last:
            //   '<i>last(x)</i>: Aggregate function: returns the last value in a group. The function by default returns the last values it sees. It will return the last non-null value it sees when ignoreNulls is set to true. If all values are null, then null is returned. .. note:: The function is non-deterministic because its results depends on order of rows which may be non-deterministic after a shuffle. .. ',
            // max:
            //   '<i>max(x)</i>: Aggregate function: returns the maximum value of the expression in a group.',
            // mean:
            //   '<i>mean(x)</i>: Aggregate function: returns the average of the values in a group.',
            // min:
            //   '<i>min(x)</i>: Aggregate function: returns the minimum value of the expression in a group.',
            //     percent_rank:
            //     '<i>percent_rank(x)</i>: Window function: returns the relative rank (i.e. percentile) of rows within a window partition.',
            //   rank:
            //     '<i>rank(x)</i>: Window function: returns the rank of rows within a window partition. The difference between rank and dense_rank is that dense_rank leaves no gaps in ranking sequence when there are ties. That is, if you were ranking a competition using dense_rank and had three people tie for second place, you would say that all three were in second place and that the next person came in third. Rank would give me sequential numbers, making the person that came in third place (after the ties) would register as coming in fifth. This is equivalent to the RANK function in SQL. .. ',

            //   row_number:
            //     '<i>row_number(x)</i>: Window function: returns a sequential number starting at 1 within a window partition.',

            weekofyear:
                '<i>weekofyear(date)</i>: Extract the week number of a given date as integer.',
            // "when": "<i>when(x)</i>: Evaluates a list of conditions and returns one of multiple possible result expressions. If :func:`Column.otherwise</i> is not invoked, None is returned for unmatched conditions. :param condition: a boolean :class:`Column</i> expression. :param value: a literal value, or a :class:`Column</i> expression. >>> df.select(when(df['age'] == 2, 3).otherwise(4).alias(\"age\")).collect() [Row(age=3), Row(age=4)] >>> df.select(when(df.age == 2, df.age + 1).alias(\"age\")).collect() [Row(age=3), Row(age=None)] .. ",
            // "window": "<i>window(x)</i>: Bucketize rows into one or more time windows given a timestamp specifying column. Window starts are inclusive but the window ends are exclusive, e.g. 12:05 will be in the window [12:05,12:10) but not in [12:00,12:05). Windows can support microsecond precision. Windows in the order of months are not supported. The time column must be of :class:`pyspark.sql.types.TimestampType`. Durations are provided as strings, e.g. '1 second', '1 day 12 hours', '2 minutes'. Valid interval strings are 'week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond'. If the <i>`slideDuration`</i> is not provided, the windows will be tumbling windows. The startTime is the offset with respect to 1970-01-01 00:00:00 UTC with which to start window intervals. For example, in order to have hourly tumbling windows that start 15 minutes past the hour, e.g. 12:15-13:15, 13:15-14:15.provide <i>startTime</i> as <i>15 minutes`. The output column will be a struct called 'window' by default with the nested columns 'start' and 'end', where 'start' and 'end' will be of :class:`pyspark.sql.types.TimestampType`. >>> df = spark.createDataFrame([(\"2016-03-11 09:00:07\", 1)]).toDF(\"date\", \"val\") >>> w = df.groupBy(window(\"date\", \"5 seconds\")).agg(sum(\"val\").alias(\"sum\")) >>> w.select(w.window.start.cast(\"string\").alias(\"start\"), .w.window.end.cast(\"string\").alias(\"end\"), \"sum\").collect() [Row(start='2016-03-11 09:00:05', end='2016-03-11 09:00:10', sum=1)] .. versionadded:: 2.0",
            // cume_dist:
            //   '<i>cume_dist(x)</i>: Window function: returns the cumulative distribution of values within a window partition, i.e. the fraction of rows that are below the current row. .. ',
            // dense_rank:
            //   '<i>dense_rank(x)</i>: Window function: returns the rank of rows within a window partition, without any gaps. The difference between rank and dense_rank is that dense_rank leaves no gaps in ranking sequence when there are ties. That is, if you were ranking a competition using dense_rank and had three people tie for second place, you would say that all three were in second place and that the next person came in third. Rank would give me sequential numbers, making the person that came in third place (after the ties) would register as coming in fifth. This is equivalent to the DENSE_RANK function in SQL. .. ',
            // ntile:
            //   '<i>ntile(x)</i>: Window function: returns the ntile group id (from 1 to <i>n</i> inclusive) in an ordered window partition. For example, if <i>n</i> is 4, the first quarter of the rows will get value 1, the second quarter will get 2, the third quarter will get 3, and the last quarter will get 4. This is equivalent to the NTILE function in SQL. :param n: an integer .. ',
            year: '<i>year(date)</i>: Extract the year of a given date as integer. '
        },
        operators: {
            'Lógicos': {
                '&&': 'Condição E (AND)',
                '||': 'Condição OU (OR)',
                '!': 'Condição NÃO (NOT)',
            },
            'Matemáticos': {
                '+': 'Adição',
                '-': 'Subtração',
                '*': 'Multiplicação',
                '/': 'Divisão',
            },
            'Relacionais': {
                '>': 'Maior que',
                '<': 'Menor que',
                '>=': 'Maior ou igual',
                '<=': 'Menor ou igual',
                '==': 'Igual (note, 2 sinais de igualdade!)',
                '!=': 'Diferente',
            }

        },
        tree: {
            functions: [
                {
                    key: 'math',
                    name: 'Matemáticas',
                    children: [
                        'abs',
                        'acos',
                        'asin',
                        'atan',
                        'atan2',
                        'bround',
                        'cbrt',
                        'ceil',
                        'cos',
                        'cosh',
                        'crc32',
                        'degrees',
                        'exp',
                        'expm1',
                        'floor',
                        'hypot',
                        'log',
                        'log10',
                        'log1p',
                        'log2',
                        'pow',
                        'radians',
                        'rand',
                        'randn',
                        'rint',
                        'round',
                        'sequence',
                        'sin',
                        'sinh',
                        'sqrt',
                        'tan',
                        'tanh'
                    ]
                },
                {
                    key: 'util',
                    name: 'Utilitárias',
                    children: [
                        'coalesce',
                        'create_map',
                        'from_json',
                        'get_json_object',
                        'greatest',
                        'hash',
                        'json_tuple',
                        'least',
                        'lit',
                        'md5',
                        'monotonically_increasing_id',
                        'nanvl',
                        'schema_of_json',
                        'sha1',
                        'sha2',
                        'shuffle',
                        'signum',
                        'to_json'
                    ]
                },
                {
                    key: 'bit',
                    name: 'Bit',
                    children: [
                        'bitwiseNOT',
                        'shiftLeft',
                        'shiftRight',
                        'shiftRightUnsigned'
                    ]
                },
                {
                    key: 'logic',
                    name: 'Lógicas/condicionais',
                    children: ['isnan', 'isnull']
                },
                {
                    key: 'vector',
                    name: 'Vetores',
                    children: [
                        'array_contains',
                        'array_distinct',
                        'array_except',
                        'array_intersect',
                        'array_join',
                        'array_max',
                        'array_min',
                        'array_position',
                        'array_remove',
                        'array_repeat',
                        'array_sort',
                        'array_union',
                        'arrays_overlap',
                        'arrays_zip',
                        'element_at',
                        'explode',
                        'explode_outer',
                        'flatten',
                        'map_concat',
                        'map_from_arrays',
                        'map_keys',
                        'map_values',
                        'posexplode',
                        'reverse',
                        'sequence',
                        'shuffle',
                        'size',
                        'slice',
                        'sort_array',
                        'struct'
                    ]
                },
                {
                    key: 'date',
                    name: 'Para data e hora',
                    children: [
                        'add_months',
                        'current_date',
                        'current_timestamp',
                        'date_add',
                        'date_format',
                        'date_sub',
                        'date_trunc',
                        'datediff',
                        'dayofmonth',
                        'dayofweek',
                        'dayofyear',
                        'from_unixtime',
                        'from_utc_timestamp',
                        'hour',
                        'last_day',
                        'minute',
                        'month',
                        'months_between',
                        'next_day',
                        'quarter',
                        'second',
                        'to_date',
                        'to_timestamp',
                        'to_utc_timestamp',
                        'trunc',
                        'unix_timestamp'
                    ]
                },
                {
                    key: 'text',
                    name: 'Para texto (String)',
                    children: [
                        'ascii',
                        'base64',
                        'basestring',
                        'bin',
                        'concat',
                        'concat_ws',
                        'conv',
                        'decode',
                        'encode',
                        'format_number',
                        'hex',
                        'initcap',
                        'instr',
                        'length',
                        'levenshtein',
                        'locate',
                        'lower',
                        'lpad',
                        'ltrim',
                        'regexp_extract',
                        'regexp_replace',
                        'repeat',
                        'reverse',
                        'rpad',
                        'rtrim',
                        'size',
                        'soundex',
                        'split',
                        'substring',
                        'substring_index',
                        'translate',
                        'trim',
                        'unbase64',
                        'unhex',
                        'upper'
                    ]
                }
            ]
        }
    }
};
