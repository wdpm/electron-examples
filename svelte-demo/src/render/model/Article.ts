export class Article {
  id: number;
  title: string;
  content: string;
  timeEdit: number;
  timeCreate: number;
  static getMetaData() {
    return {
      name: "Article",
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        title: { notNull: true, dataType: "string" },
        content: { notNull: true, dataType: "string" },
        timeEdit: { notNull: true, dataType: "number" },
        timeCreate: { notNull: true, dataType: "number" },
      },
    };
  }
}
