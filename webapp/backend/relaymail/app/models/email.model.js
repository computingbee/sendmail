module.exports = (mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
        {
            clientIP: String,
            from: String,
            to: [{ type: String }],
            cc: [{ type: String }],
            bcc: [{ type: String }],
            subject: String,
            message: String,
            attachments: [{ type: String }],
            sent: Boolean
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    schema.plugin(mongoosePaginate);

    const Email = mongoose.model("email", schema);
    return Email;
}