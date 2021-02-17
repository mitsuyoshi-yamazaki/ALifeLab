import { URLParameterParser } from "../../src/classes/url_parameter_parser"

describe("Int", () => {
  test("Default value", () => {
    expect((new URLParameterParser("?")).int("test1", 3244, "t1"))
      .toBe(3244)
  })

  test("Full name", () => {
    expect((new URLParameterParser("?test1=5")).int("test1", 3244, "t1"))
      .toBe(5)
  })

  test("Short name", () => {
    expect((new URLParameterParser("?t1=11")).int("test1", 3244, "t1"))
      .toBe(11)
  })

  test("Floating value", () => {
    expect((new URLParameterParser("?test1=3.14")).int("test1", 3244, "t1"))
      .toBe(3)
  })
})

describe("Float", () => {
  test("Default value", () => {
    expect((new URLParameterParser("?")).float("test1", 3244, "t1"))
      .toBe(3244)
  })

  test("Full name", () => {
    expect((new URLParameterParser("?test1=5")).float("test1", 3244, "t1"))
      .toBe(5)
  })

  test("Short name", () => {
    expect((new URLParameterParser("?t1=11")).float("test1", 3244, "t1"))
      .toBe(11)
  })

  test("Floating value", () => {
    expect((new URLParameterParser("?test1=3.14")).float("test1", 3244, "t1"))
      .toBe(3.14)
  })
})

describe("Boolean", () => {
  test("Default value (false)", () => {
    expect((new URLParameterParser("?")).boolean("test1", false, "t1"))
      .toBe(false)
    expect((new URLParameterParser("?test1=a")).boolean("test1", false, "t1"))
      .toBe(false)
    expect((new URLParameterParser("?t1=a")).boolean("test1", false, "t1"))
      .toBe(false)
  })

  test("Default value (true)", () => {
    expect((new URLParameterParser("?")).boolean("test1", true, "t1"))
      .toBe(true)
    expect((new URLParameterParser("?test1=a")).boolean("test1", true, "t1"))
      .toBe(true)
    expect((new URLParameterParser("?t1=a")).boolean("test1", true, "t1"))
      .toBe(true)
  })

  test("Falthy value", () => {
    expect((new URLParameterParser("?test1=0")).boolean("test1", true, "t1"))
      .toBe(false)
    expect((new URLParameterParser("?t1=0")).boolean("test1", true, "t1"))
      .toBe(false)
  })

  test("Truthy value", () => {
    expect((new URLParameterParser("?test1=1")).boolean("test1", false, "t1"))
      .toBe(true)
    expect((new URLParameterParser("?t1=1")).boolean("test1", false, "t1"))
      .toBe(true)
    expect((new URLParameterParser("?test1=5")).boolean("test1", false, "t1"))
      .toBe(true)
    expect((new URLParameterParser("?t1=5")).boolean("test1", false, "t1"))
      .toBe(true)
  })
})

describe("String", () => {
  test("Default value", () => {
    expect((new URLParameterParser("?")).string("test1", "default", "t1"))
      .toBe("default")
  })

  test("Full name", () => {
    expect((new URLParameterParser("?test1=hoge")).string("test1", "default", "t1"))
      .toBe("hoge")
  })

  test("Short name", () => {
    expect((new URLParameterParser("?t1=fuga")).string("test1", "default", "t1"))
      .toBe("fuga")
  })

  test("Number", () => {
    expect((new URLParameterParser("?test1=3.14")).string("test1", "default", "t1"))
      .toBe("3.14")
  })
})

describe("Parameter", () => {
  test("", () => {
    const parser = new URLParameterParser("?test1=hoge&t2=3.14")
    parser.string("test1", "default_value", "t1")
    parser.float("test2", 5, "t2")
    parser.int("test3", 3244, "t3")

    expect(parser.parameters.get("test1"))
      .toBe("hoge")
    expect(parser.parameters.get("test2"))
      .toBe(3.14)
    expect(parser.parameters.get("test3"))
      .toBe(3244)
  })
})
